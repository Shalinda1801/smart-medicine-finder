import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const medicines = await prisma.medicine.count();
  const pharmacies = await prisma.pharmacy.count();
  const inventory = await prisma.inventory.count();

  const cities = await prisma.pharmacy.findMany({
    select: {
      city: true,
    },
    distinct: ["city"],
    orderBy: {
      city: "asc",
    },
  });

  console.log("\n===== DATABASE SUMMARY =====");
  console.log("Medicines:", medicines);
  console.log("Pharmacies:", pharmacies);
  console.log("Inventory records:", inventory);

  console.log("\n===== CITIES =====");

  cities.forEach((item) => {
    console.log("-", item.city);
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
