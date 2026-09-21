import {redirect} from "next/navigation";
import {learningActor,commandForActor} from "@/lib/lms/server";
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const actor=await learningActor();
 const data=await commandForActor(actor,{action:"learning.get",payload:{id:(await params).id}});
 redirect(`/dashboard/programmes/${data.programme.id}?view=learn`);
}
