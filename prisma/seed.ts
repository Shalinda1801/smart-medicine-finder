import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

import {
  PharmacyMemberRole,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to the .env file.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  console.log("Starting database seed...");

  const passwordHash = await bcrypt.hash(
    "Password123!",
    12,
  );

  // --------------------------------------------------
  // Demo users
  // --------------------------------------------------

  const customer = await prisma.user.upsert({
    where: {
      email: "customer@demo.com",
    },
    update: {
      name: "Demo Customer",
      passwordHash,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Demo Customer",
      email: "customer@demo.com",
      passwordHash,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  const cityCareStaff = await prisma.user.upsert({
    where: {
      email: "citycare@demo.com",
    },
    update: {
      name: "CityCare Pharmacy Staff",
      passwordHash,
      role: UserRole.PHARMACY_STAFF,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "CityCare Pharmacy Staff",
      email: "citycare@demo.com",
      passwordHash,
      role: UserRole.PHARMACY_STAFF,
      status: UserStatus.ACTIVE,
    },
  });

  const healthHubStaff = await prisma.user.upsert({
    where: {
      email: "healthhub@demo.com",
    },
    update: {
      name: "HealthHub Pharmacy Staff",
      passwordHash,
      role: UserRole.PHARMACY_STAFF,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "HealthHub Pharmacy Staff",
      email: "healthhub@demo.com",
      passwordHash,
      role: UserRole.PHARMACY_STAFF,
      status: UserStatus.ACTIVE,
    },
  });

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@demo.com",
    },
    update: {
      name: "Demo Administrator",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Demo Administrator",
      email: "admin@demo.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // --------------------------------------------------
  // Demo pharmacies
  // --------------------------------------------------

  const cityCare = await prisma.pharmacy.upsert({
    where: {
      slug: "citycare-demo-pharmacy",
    },
    update: {
      name: "CityCare Demo Pharmacy",
      verificationStatus: VerificationStatus.APPROVED,
      verifiedAt: new Date(),
    },
    create: {
      slug: "citycare-demo-pharmacy",
      name: "CityCare Demo Pharmacy",
      licenceNumber: "DEMO-LIC-001",
      phone: "+94 11 000 0001",
      email: "citycare.pharmacy@example.com",
      addressLine1: "100 Demo Road",
      city: "Colombo",
      district: "Colombo",
      postalCode: "00100",
      latitude: 6.9271,
      longitude: 79.8612,
      verificationStatus: VerificationStatus.APPROVED,
      verifiedAt: new Date(),
    },
  });

  const healthHub = await prisma.pharmacy.upsert({
    where: {
      slug: "healthhub-demo-pharmacy",
    },
    update: {
      name: "HealthHub Demo Pharmacy",
      verificationStatus: VerificationStatus.APPROVED,
      verifiedAt: new Date(),
    },
    create: {
      slug: "healthhub-demo-pharmacy",
      name: "HealthHub Demo Pharmacy",
      licenceNumber: "DEMO-LIC-002",
      phone: "+94 11 000 0002",
      email: "healthhub.pharmacy@example.com",
      addressLine1: "200 Sample Avenue",
      city: "Colombo",
      district: "Colombo",
      postalCode: "00200",
      latitude: 6.9147,
      longitude: 79.8777,
      verificationStatus: VerificationStatus.APPROVED,
      verifiedAt: new Date(),
    },
  });

  // --------------------------------------------------
  // Connect pharmacy staff to pharmacies
  // --------------------------------------------------

  await prisma.pharmacyMember.upsert({
    where: {
      userId_pharmacyId: {
        userId: cityCareStaff.id,
        pharmacyId: cityCare.id,
      },
    },
    update: {
      memberRole: PharmacyMemberRole.OWNER,
    },
    create: {
      userId: cityCareStaff.id,
      pharmacyId: cityCare.id,
      memberRole: PharmacyMemberRole.OWNER,
    },
  });

  await prisma.pharmacyMember.upsert({
    where: {
      userId_pharmacyId: {
        userId: healthHubStaff.id,
        pharmacyId: healthHub.id,
      },
    },
    update: {
      memberRole: PharmacyMemberRole.OWNER,
    },
    create: {
      userId: healthHubStaff.id,
      pharmacyId: healthHub.id,
      memberRole: PharmacyMemberRole.OWNER,
    },
  });

  // --------------------------------------------------
  // Medicine catalogue
  // --------------------------------------------------

  const medicineData = [
    {
      code: "MED-PARA-500-TAB",
      genericName: "Paracetamol",
      brandName: "Demo Para",
      dosage: "500 mg",
      form: "Tablet",
      activeIngredient: "Paracetamol",
      prescriptionRequired: false,
    },
    {
      code: "MED-AMOX-500-CAP",
      genericName: "Amoxicillin",
      brandName: "Demo Amox",
      dosage: "500 mg",
      form: "Capsule",
      activeIngredient: "Amoxicillin",
      prescriptionRequired: true,
    },
    {
      code: "MED-CETI-10-TAB",
      genericName: "Cetirizine",
      brandName: "Demo Ceti",
      dosage: "10 mg",
      form: "Tablet",
      activeIngredient: "Cetirizine Hydrochloride",
      prescriptionRequired: false,
    },
    {
      code: "MED-OMEP-20-CAP",
      genericName: "Omeprazole",
      brandName: "Demo Ome",
      dosage: "20 mg",
      form: "Capsule",
      activeIngredient: "Omeprazole",
      prescriptionRequired: false,
    },
    {
      code: "MED-IBU-400-TAB",
      genericName: "Ibuprofen",
      brandName: "Demo Ibu",
      dosage: "400 mg",
      form: "Tablet",
      activeIngredient: "Ibuprofen",
      prescriptionRequired: false,
    },
  ];

  const medicines = [];

  for (const medicine of medicineData) {
    const savedMedicine = await prisma.medicine.upsert({
      where: {
        code: medicine.code,
      },
      update: medicine,
      create: medicine,
    });

    medicines.push(savedMedicine);
  }

  // --------------------------------------------------
  // Pharmacy inventory
  // --------------------------------------------------

  const inventoryData = [
    {
      pharmacyId: cityCare.id,
      medicineId: medicines[0].id,
      quantity: 50,
      reservedQuantity: 0,
      lowStockThreshold: 10,
      price: "120.00",
    },
    {
      pharmacyId: cityCare.id,
      medicineId: medicines[1].id,
      quantity: 20,
      reservedQuantity: 0,
      lowStockThreshold: 5,
      price: "450.00",
    },
    {
      pharmacyId: cityCare.id,
      medicineId: medicines[2].id,
      quantity: 8,
      reservedQuantity: 0,
      lowStockThreshold: 10,
      price: "180.00",
    },
    {
      pharmacyId: healthHub.id,
      medicineId: medicines[0].id,
      quantity: 35,
      reservedQuantity: 0,
      lowStockThreshold: 8,
      price: "115.00",
    },
    {
      pharmacyId: healthHub.id,
      medicineId: medicines[3].id,
      quantity: 15,
      reservedQuantity: 0,
      lowStockThreshold: 5,
      price: "380.00",
    },
    {
      pharmacyId: healthHub.id,
      medicineId: medicines[4].id,
      quantity: 0,
      reservedQuantity: 0,
      lowStockThreshold: 5,
      price: "220.00",
    },
  ];

  for (const inventory of inventoryData) {
    await prisma.inventory.upsert({
      where: {
        pharmacyId_medicineId: {
          pharmacyId: inventory.pharmacyId,
          medicineId: inventory.medicineId,
        },
      },
      update: {
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        lowStockThreshold: inventory.lowStockThreshold,
        price: inventory.price,
        lastRestockedAt: new Date(),
      },
      create: {
        ...inventory,
        lastRestockedAt: new Date(),
      },
    });
  }

  console.log("Database seed completed successfully.");
  console.log("");
  console.log("Demo accounts:");
  console.log("Customer: customer@demo.com");
  console.log("Pharmacy 1: citycare@demo.com");
  console.log("Pharmacy 2: healthhub@demo.com");
  console.log("Admin: admin@demo.com");
  console.log("Password for all accounts: Password123!");
  console.log("");
  console.log(`Customer ID: ${customer.id}`);
  console.log(`Admin ID: ${admin.id}`);
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });