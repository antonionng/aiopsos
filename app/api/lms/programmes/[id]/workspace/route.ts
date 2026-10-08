import { NextResponse } from "next/server";
import { z } from "zod";
import { deliveryCommand } from "@/lib/lms/delivery-server";
import { deliveryCommandSchema } from "@/lib/lms/delivery-schema";
import { LearningError, learningErrorResponse, learningActor } from "@/lib/lms/server";
import { rateLimit } from "@/lib/rate-limit";
type Context = {params: Promise<{id: string}>};
export async function GET(request: Request, context: Context) {
  try {
    const id=z.string().uuid().parse((await context.params).id);
    return NextResponse.json(await deliveryCommand(id,new URL(request.url).searchParams.get("view")==="live"?"live.get":"get"), {headers:{"Cache-Control":"no-store"}});
  } catch(error) { return learningErrorResponse(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    const actor=await learningActor();
    if (!rateLimit(`delivery:${actor.userId}`, {limit:60,windowMs:60000}).success) throw new LearningError("Please wait before trying again.",429);
    const id=z.string().uuid().parse((await context.params).id);
    const key=z.string().uuid().safeParse(request.headers.get("Idempotency-Key"));
    if (!key.success) throw new LearningError("A unique request identifier is required.");
    const raw=await request.text();
    if(raw.length>250000) throw new LearningError("The assessment plan is too large.",413);
    const parsed=deliveryCommandSchema.safeParse(JSON.parse(raw));
    if(!parsed.success) throw new LearningError(parsed.error.issues.map(i=>i.message).slice(0,3).join(" "));
    const {action,...payload}=parsed.data;
    return NextResponse.json(await deliveryCommand(id,action,payload,key.data), {headers:{"Cache-Control":"no-store"}});
  } catch(error) { return learningErrorResponse(error); }
}
