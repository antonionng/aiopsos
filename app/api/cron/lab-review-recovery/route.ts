import { NextResponse } from "next/server";
import { recoverLabReviews } from "@/lib/lms/lab-ai-server";
export const maxDuration=120;
export const dynamic="force-dynamic";
export async function GET(request:Request) {
 const headers={"Cache-Control":"no-store"};
 if(!process.env.CRON_SECRET || request.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({error:"Unauthorized"},{status:401,headers});
 try {return NextResponse.json(await recoverLabReviews(),{headers});}
 catch {return NextResponse.json({error:"Review queue unavailable"},{status:503,headers});}
}
