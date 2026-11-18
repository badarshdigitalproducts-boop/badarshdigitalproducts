import { NextResponse } from "next/server";
import { getAdminServices } from "@/lib/admin/store";
import { services as fallbackServices } from "@/content/services";

export async function GET() {
  try {
    const adminServices = await getAdminServices();
    const allServices = adminServices && adminServices.length > 0 ? adminServices : fallbackServices;
    const active = allServices.filter((s: any) => s.status === "active" || !s.status);
    return NextResponse.json({ services: active, total: active.length });
  } catch (error) {
    console.error("Error reading services:", error);
    return NextResponse.json({ services: fallbackServices, total: fallbackServices.length });
  }
}
