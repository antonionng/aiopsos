import { NextResponse } from "next/server";
import { deliveryCommand } from "@/lib/lms/delivery-server";
import { learningErrorResponse } from "@/lib/lms/server";
export async function GET() {
  try { return NextResponse.json(await deliveryCommand(null,"list"), {headers:{"Cache-Control":"no-store"}}); }
  catch(error) { return learningErrorResponse(error); }
}
