"use client";
import {useState} from "react";
export function EvidenceUpload({programmeId,assignmentId,activityId,refresh}:{programmeId:string;assignmentId:string;activityId:string;refresh:()=>Promise<void>}) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 return <div className="lms-form"><label>Attach evidence to your next submission (up to 4 MB per file)<input type="file" disabled={busy} accept=".pdf,.csv,.txt,.sql,.py,.ipynb,.xlsx,.pptx,.docx,.png,.jpg,.jpeg,.pbix" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setBusy(true);setMessage("");const body=new FormData();body.set("file",file);body.set("assignment_id",assignmentId);body.set("activity_id",activityId);try{const res=await fetch(`/api/lms/programmes/${programmeId}/files`,{method:"POST",body});const d=await res.json();if(!res.ok)throw Error(d.error);setMessage("Attached. Select Submit for review to send it with your response.");await refresh();}catch(error){setMessage(error instanceof Error?error.message:"Upload failed");}finally{setBusy(false);}}}/></label><p role="status" className="text-sm">{busy?"Uploading evidence…":message}</p></div>;
}
