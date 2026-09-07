import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { VerificationStatus } from "../src/generated/prisma/enums";

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

const pharmacies = [
  {
    slug: "kandy-care-pharmacy",
    name: "Kandy Care Pharmacy",
    phone: "0812234567",
    email: "kandycare@example.com",
    addressLine1: "25 Peradeniya Road",
    city: "Kandy",
    district: "Kandy",
    postalCode: "20000",
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    slug: "central-kandy-pharmacy",
    name: "Central Kandy Pharmacy",
    phone: "0812345678",
    email: "centralkandy@example.com",
    addressLine1: "48 D.S. Senanayake Street",
    city: "Kandy",
    district: "Kandy",
    postalCode: "20000",
    latitude: 7.2936,
    longitude: 80.6413,
  },

  {
    slug: "galle-health-pharmacy",
    name: "Galle Health Pharmacy",
    phone: "0912234567",
    email: "gallehealth@example.com",
    addressLine1: "15 Wakwella Road",
    city: "Galle",
    district: "Galle",
    postalCode: "80000",
    latitude: 6.0329,
    longitude: 80.2168,
  },
  {
    slug: "southern-care-pharmacy",
    name: "Southern Care Pharmacy",
    phone: "0912345678",
    email: "southerncare@example.com",
    addressLine1: "72 Matara Road",
    city: "Galle",
    district: "Galle",
    postalCode: "80000",
    latitude: 6.0377,
    longitude: 80.2152,
  },

  {
    slug: "jaffna-medical-pharmacy",
    name: "Jaffna Medical Pharmacy",
    phone: "0212234567",
    email: "jaffnamedical@example.com",
    addressLine1: "10 Hospital Road",
    city: "Jaffna",
    district: "Jaffna",
    postalCode: "40000",
    latitude: 9.6615,
    longitude: 80.0255,
  },
  {
    slug: "northern-health-pharmacy",
    name: "Northern Health Pharmacy",
    phone: "0212345678",
    email: "northernhealth@example.com",
    addressLine1: "35 Stanley Road",
    city: "Jaffna",
    district: "Jaffna",
    postalCode: "40000",
    latitude: 9.6650,
    longitude: 80.0200,
  },

  {
    slug: "negombo-care-pharmacy",
    name: "Negombo Care Pharmacy",
    phone: "0312234567",
    email: "negombocare@example.com",
    addressLine1: "20 Colombo Road",
    city: "Negombo",
    district: "Gampaha",
    postalCode: "11500",
    latitude: 7.2083,
    longitude: 79.8358,
  },
  {
    slug: "negombo-health-pharmacy",
    name: "Negombo Health Pharmacy",
    phone: "0312345678",
    email: "negombohealth@example.com",
    addressLine1: "55 Main Street",
    city: "Negombo",
    district: "Gampaha",
    postalCode: "11500",
    latitude: 7.2140,
    longitude: 79.8380,
  },

  {
    slug: "kurunegala-care-pharmacy",
    name: "Kurunegala Care Pharmacy",
    phone: "0372234567",
    email: "kurunegalacare@example.com",
    addressLine1: "18 Kandy Road",
    city: "Kurunegala",
    district: "Kurunegala",
    postalCode: "60000",
    latitude: 7.4863,
    longitude: 80.3623,
  },
  {
    slug: "wayamba-medical-pharmacy",
    name: "Wayamba Medical Pharmacy",
    phone: "0372345678",
    email: "wayambamedical@example.com",
    addressLine1: "42 Colombo Road",
    city: "Kurunegala",
    district: "Kurunegala",
    postalCode: "60000",
    latitude: 7.4818,
    longitude: 80.3609,
  },

  {
    slug: "gampaha-health-pharmacy",
    name: "Gampaha Health Pharmacy",
    phone: "0332234567",
    email: "gampahahealth@example.com",
    addressLine1: "12 Kandy Road",
    city: "Gampaha",
    district: "Gampaha",
    postalCode: "11000",
    latitude: 7.0917,
    longitude: 80.0000,
  },
  {
    slug: "gampaha-care-pharmacy",
    name: "Gampaha Care Pharmacy",
    phone: "0332345678",
    email: "gampahacare@example.com",
    addressLine1: "38 Queen Mary Road",
    city: "Gampaha",
    district: "Gampaha",
    postalCode: "11000",
    latitude: 7.0897,
    longitude: 79.9990,
  },

  {
    slug: "matara-medical-pharmacy",
    name: "Matara Medical Pharmacy",
    phone: "0412234567",
    email: "mataramedical@example.com",
    addressLine1: "22 Akuressa Road",
    city: "Matara",
    district: "Matara",
    postalCode: "81000",
    latitude: 5.9549,
    longitude: 80.5550,
  },
  {
    slug: "matara-health-pharmacy",
    name: "Matara Health Pharmacy",
    phone: "0412345678",
    email: "matarahealth@example.com",
    addressLine1: "60 Main Street",
    city: "Matara",
    district: "Matara",
    postalCode: "81000",
    latitude: 5.9496,
    longitude: 80.5353,
  },

  {
    slug: "anuradhapura-care-pharmacy",
    name: "Anuradhapura Care Pharmacy",
    phone: "0252234567",
    email: "anuradhapuracare@example.com",
    addressLine1: "30 Maithripala Senanayake Mawatha",
    city: "Anuradhapura",
    district: "Anuradhapura",
    postalCode: "50000",
    latitude: 8.3114,
    longitude: 80.4037,
  },
  {
    slug: "heritage-medical-pharmacy",
    name: "Heritage Medical Pharmacy",
    phone: "0252345678",
    email: "heritagemedical@example.com",
    addressLine1: "15 New Town Road",
    city: "Anuradhapura",
    district: "Anuradhapura",
    postalCode: "50000",
    latitude: 8.3120,
    longitude: 80.4150,
  },

  {
    slug: "nuwara-eliya-health-pharmacy",
    name: "Nuwara Eliya Health Pharmacy",
    phone: "0522234567",
    email: "nuwarahealth@example.com",
    addressLine1: "18 Udupussellawa Road",
    city: "Nuwara Eliya",
    district: "Nuwara Eliya",
    postalCode: "22200",
    latitude: 6.9497,
    longitude: 80.7891,
  },
  {
    slug: "hill-country-pharmacy",
    name: "Hill Country Pharmacy",
    phone: "0522345678",
    email: "hillcountry@example.com",
    addressLine1: "40 Badulla Road",
    city: "Nuwara Eliya",
    district: "Nuwara Eliya",
    postalCode: "22200",
    latitude: 6.9700,
    longitude: 80.7700,
  },
];

async function main() {
  console.log("\nAdding demo pharmacies...\n");

  const medicineList = await prisma.medicine.findMany({
    where: {
      active: true,
    },
    orderBy: {
      genericName: "asc",
    },
  });

  if (medicineList.length === 0) {
    throw new Error(
      "No active medicines found. Please run the original seed first.",
    );
  }

  console.log(`Found ${medicineList.length} existing medicines.`);

  let pharmacyCount = 0;
  let inventoryCount = 0;

  for (let i = 0; i < pharmacies.length; i++) {
    const data = pharmacies[i];

    const pharmacy = await prisma.pharmacy.upsert({
      where: {
        slug: data.slug,
      },
      update: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        addressLine1: data.addressLine1,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
      },
      create: {
        ...data,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
      },
    });

    pharmacyCount++;

    console.log(`? ${pharmacy.name} - ${pharmacy.city}`);

    for (let j = 0; j < medicineList.length; j++) {
      const medicine = medicineList[j];

      // Different prices between pharmacies.
      const basePrices: Record<string, number> = {
        Paracetamol: 120,
        Ibuprofen: 180,
        Cetirizine: 95,
        Amoxicillin: 250,
        Omeprazole: 220,
      };

      const basePrice =
        basePrices[medicine.genericName] ?? 150;

      // Creates realistic price variation between pharmacies.
      const variation = ((i * 17 + j * 11) % 60) - 30;

      const price = Math.max(
        50,
        basePrice + variation,
      );

      // Different stock levels.
      const quantity =
        20 + ((i * 23 + j * 17) % 100);

      const reservedQuantity =
        j % 4 === 0
          ? Math.min(5, Math.floor(quantity / 4))
          : 0;

      await prisma.inventory.upsert({
        where: {
          pharmacyId_medicineId: {
            pharmacyId: pharmacy.id,
            medicineId: medicine.id,
          },
        },

        update: {
          price: price.toFixed(2),
          quantity,
          reservedQuantity,
          lowStockThreshold: 10,
          isActive: true,
          lastRestockedAt: new Date(),
        },

        create: {
          pharmacyId: pharmacy.id,
          medicineId: medicine.id,
          price: price.toFixed(2),
          quantity,
          reservedQuantity,
          lowStockThreshold: 10,
          isActive: true,
          lastRestockedAt: new Date(),
        },
      });

      inventoryCount++;
    }
  }

  console.log("\n================================");
  console.log("Demo data added successfully!");
  console.log("================================");
  console.log(`Pharmacies processed: ${pharmacyCount}`);
  console.log(`Inventory records processed: ${inventoryCount}`);
  console.log(`Medicines used: ${medicineList.length}`);
  console.log("================================\n");
}

main()
  .catch((error) => {
    console.error("\nERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
