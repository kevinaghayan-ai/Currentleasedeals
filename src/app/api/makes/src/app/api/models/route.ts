// Returns models for ?make=Toyota&year=2025 (or current year if omitted)
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // 1 day

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const make = (searchParams.get("make") || "").trim();
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  if (!make) {
    return NextResponse.json({ error: "Missing ?make=" }, { status: 400 });
  }

  // vPIC: Models for make + year (vehicle type filter optional here)
  // Example: /GetModelsForMakeYear/make/Toyota/modelyear/2025?format=json
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(
    make
  )}/modelyear/${year}?format=json`;

  const rs = await fetch(url);
  const data = await rs.json();
  const models = (data?.Results ?? [])
    .map((r: any) => r.Model_Name?.trim())
    .filter(Boolean)
    .map((m: string) => m.replace(/\s+/g, " "))
    .sort((a: string, b: string) => a.localeCompare(b));

  return NextResponse.json({ year, make, models });
}
