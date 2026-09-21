import {DeliveryWorkspaceView} from "@/components/lms/delivery-workspace";
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{view?:string}>}) {
 const [{id},{view}]=await Promise.all([params,searchParams]);
 return <DeliveryWorkspaceView programmeId={id} initialView={view}/>;
}
