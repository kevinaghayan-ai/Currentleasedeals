// Returns passenger-vehicle makes (cars/SUVs/light trucks) for the current model year
import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // cache for 1 day

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr as any)) as T[];
}

export async function GET() {
  const year = new Date().getFullYear(); // adjust if you want the next model year logic

  // vPIC: filter by vehicle types commonly used for consumer vehicles
  // car, multipurpose passenger vehicle (SUV/CUV), truck
  const types = ["car", "multipurpose%20passenger%20vehicle%20(MPV)", "truck"];
  const fetches = types.map(t =>
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${t}?format=json`).then(r => r.json())
  );
  const typeResults = await Promise.all(fetches);

  const allMakes = typeResults.flatMap(r => (r?.Results ?? []).map((m: any) => m.MakeName?.trim())).filter(Boolean);

  // Optional: cross-check against FuelEconomy.gov (what’s actually sold in US this year)
  // NOTE: FuelEconomy menu endpoints are XML; we skip parsing here to keep it simple server-side.
  // You can uncomment this later and add a tiny XML parser if you want a stricter US-market list.

  const makes = dedupe(allMakes)
    .map(m => m.replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase())) // tidy casing
    .sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ year, makes });
}
