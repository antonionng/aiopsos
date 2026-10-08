import { NextResponse } from "next/server";
import { findSignedRecord } from "@/lib/self-serve/records";
import { renderSelfServeCertificate } from "@/lib/pdf/self-serve-certificate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const record = await findSignedRecord(ref);
  if (!record) {
    return NextResponse.json({ detail: "No record matches that reference." }, { status: 404 });
  }

  const pdf = await renderSelfServeCertificate(record);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${record.ref}.pdf"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
