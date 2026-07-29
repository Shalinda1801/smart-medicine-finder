import { apiSuccess } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return apiSuccess({
    service: "smart-medicine-finder-api",
    status: "healthy",
    database: "not-checked",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}