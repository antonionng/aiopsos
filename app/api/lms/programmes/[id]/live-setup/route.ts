import {NextResponse} from "next/server";
import {z} from "zod";
import {deliveryCommand} from "@/lib/lms/delivery-server";
import {LearningError,learningErrorResponse} from "@/lib/lms/server";
import {fetchPublishedCourses} from "@/lib/courses";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 try{const id=z.string().uuid().parse((await params).id);const workspace=await deliveryCommand(id,"get");if(workspace.role!=="manager")throw new LearningError("The provider manager sets up teaching groups.",403);const courses=await fetchPublishedCourses();return NextResponse.json({courses:courses.map(c=>({id:c.id,title:c.title}))},{headers:{"Cache-Control":"no-store"}});}catch(e){return learningErrorResponse(e);}
}
