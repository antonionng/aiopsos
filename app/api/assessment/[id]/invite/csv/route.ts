import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    if (
      !profile?.org_id ||
      !["admin", "super_admin"].includes(profile.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0)
      return NextResponse.json({ error: "Empty file" }, { status: 400 });

    // Detect header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader =
      firstLine.includes("email") ||
      firstLine.includes("name") ||
      firstLine.includes("department");
    const dataLines = hasHeader ? lines.slice(1) : lines;

    // Determine column mapping from header
    let emailCol = 0;
    let nameCol = 1;
    let deptCol = 2;

    if (hasHeader) {
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const ei = headers.findIndex((h) => h.includes("email"));
      const ni = headers.findIndex(
        (h) => h.includes("name") && !h.includes("email")
      );
      const di = headers.findIndex(
        (h) => h.includes("dept") || h.includes("department") || h.includes("team")
      );
      if (ei >= 0) emailCol = ei;
      if (ni >= 0) nameCol = ni;
      if (di >= 0) deptCol = di;
    }

    const rows: { email: string; name: string; department: string; valid: boolean }[] = [];
    const seen = new Set<string>();

    for (const line of dataLines) {
      const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const email = (cols[emailCol] ?? "").toLowerCase();
      const name = cols[nameCol] ?? "";
      const department = cols[deptCol] ?? "";
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !seen.has(email);
      if (email) seen.add(email);
      rows.push({ email, name, department, valid });
    }

    return NextResponse.json({
      rows,
      total: rows.length,
      valid: rows.filter((r) => r.valid).length,
    });
  } catch (err) {
    console.error("CSV parse error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
