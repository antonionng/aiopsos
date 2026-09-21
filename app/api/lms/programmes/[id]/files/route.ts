import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deliveryCommand } from "@/lib/lms/delivery-server";
import type { DeliveryWorkspace } from "@/lib/lms/delivery-schema";
import { LearningError, learningActor, learningErrorResponse } from "@/lib/lms/server";
import { rateLimit } from "@/lib/rate-limit";
type Context={params:Promise<{id:string}>};
export async function POST(request: Request, context: Context) {
  try {
    const actor=await learningActor();
    if(!rateLimit(`evidence:${actor.userId}`,{limit:12,windowMs:60000}).success) throw new LearningError("Please wait before uploading more evidence.",429);
    const id=z.string().uuid().parse((await context.params).id);
    if(Number(request.headers.get("Content-Length"))>4100000) throw new LearningError("Files must be no larger than 4 MB.",413);
    const body=await request.formData();
    const assignmentId=z.string().uuid().parse(body.get("assignment_id"));
    const activityId=z.string().uuid().parse(body.get("activity_id"));
    const file=body.get("file");
    if(!(file instanceof File)||file.size<1||file.size>4000000) throw new LearningError("Choose a file between 1 byte and 4 MB.");
    if(!/\.(pdf|csv|txt|sql|py|ipynb|xlsx|pptx|docx|png|jpg|jpeg|pbix)$/i.test(file.name)) throw new LearningError("Use a document, image, notebook, SQL, Python, CSV or Power BI file.");
    const workspace=await deliveryCommand(id,"get") as DeliveryWorkspace;
    const record=workspace.records.find(r=>r.id===assignmentId && r.user_id===actor.userId);
    const activity=workspace.activities.find(a=>a.id===activityId);
    if(!record || !activity || !["practice","observation"].includes(activity.kind) || !workspace.plan?.released_at) throw new LearningError("Upload evidence to your own practical activity in a released programme.",403);
    const current=record.progress.find(p=>p.activity_id===activityId);
    if(current && ["passed","submitted"].includes(current.state)) throw new LearningError("Wait for feedback before uploading another attempt.",409);
    if(record.files.filter(f=>f.activity_id===activityId&&!f.attempt_id).length>=10) throw new LearningError("An attempt can contain at most ten files.");
    const fileId=crypto.randomUUID();
    const objectPath=`${id}/${assignmentId}/${fileId}`;
    const bytes=Buffer.from(await file.arrayBuffer());
    const {error}=await supabaseAdmin.storage.from("learning-evidence").upload(objectPath,bytes,{contentType:"application/octet-stream",upsert:false});
    if(error) throw new LearningError("The evidence file could not be stored. Please retry.",503);
    const result=await deliveryCommand(id,"file.register",{id:fileId,assignment_id:assignmentId,activity_id:activityId,
      name:file.name.replace(/[\r\n\x00-\x1f]/g,"").slice(0,180),bytes:file.size,sha256:createHash("sha256").update(bytes).digest("hex"),object_path:objectPath});
    return NextResponse.json(result,{status:201});
  } catch(error) { return learningErrorResponse(error); }
}
export async function GET(request: Request, context: Context) {
  try {
    const id=z.string().uuid().parse((await context.params).id);
    const fileId=z.string().uuid().parse(new URL(request.url).searchParams.get("file"));
    const file=await deliveryCommand(id,"file.read",{id:fileId}) as {object_path:string;name:string};
    const {data,error}=await supabaseAdmin.storage.from("learning-evidence").download(file.object_path);
    if(error||!data) throw new LearningError("This evidence file is unavailable.",404);
    return new Response(data,{headers:{"Content-Type":"application/octet-stream","Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"sandbox"}});
  } catch(error) { return learningErrorResponse(error); }
}
