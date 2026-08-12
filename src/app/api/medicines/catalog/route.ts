import {
  apiSuccess,
  handleRouteError,
} from "@/lib/api-response";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const medicines =
      await prisma.medicine.findMany({
        where: {
          active: true,
        },

        orderBy: [
          {
            genericName: "asc",
          },
          {
            dosage: "asc",
          },
        ],

        select: {
          id: true,
          code: true,
          genericName: true,
          brandName: true,
          dosage: true,
          form: true,
          activeIngredient: true,
          prescriptionRequired: true,
        },
      });

    return apiSuccess({
      items: medicines,
      total: medicines.length,
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}