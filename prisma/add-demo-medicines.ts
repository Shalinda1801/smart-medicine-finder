import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

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

const medicines = [
  {
    code: "MED-006",
    genericName: "Azithromycin",
    brandName: "Azithro",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Azithromycin",
    description: "Macrolide antibiotic",
    prescriptionRequired: true,
  },
  {
    code: "MED-007",
    genericName: "Loratadine",
    brandName: "Claritin",
    dosage: "10 mg",
    form: "Tablet",
    activeIngredient: "Loratadine",
    description: "Antihistamine for allergy symptoms",
    prescriptionRequired: false,
  },
  {
    code: "MED-008",
    genericName: "Diclofenac",
    brandName: "Voltaren",
    dosage: "50 mg",
    form: "Tablet",
    activeIngredient: "Diclofenac Sodium",
    description: "Non-steroidal anti-inflammatory medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-009",
    genericName: "Metformin",
    brandName: "Glucophage",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Metformin Hydrochloride",
    description: "Medicine commonly used to manage type 2 diabetes",
    prescriptionRequired: true,
  },
  {
    code: "MED-010",
    genericName: "Amlodipine",
    brandName: "Norvasc",
    dosage: "5 mg",
    form: "Tablet",
    activeIngredient: "Amlodipine",
    description: "Calcium channel blocker",
    prescriptionRequired: true,
  },
  {
    code: "MED-011",
    genericName: "Losartan",
    brandName: "Cozaar",
    dosage: "50 mg",
    form: "Tablet",
    activeIngredient: "Losartan Potassium",
    description: "Angiotensin receptor blocker",
    prescriptionRequired: true,
  },
  {
    code: "MED-012",
    genericName: "Atorvastatin",
    brandName: "Lipitor",
    dosage: "20 mg",
    form: "Tablet",
    activeIngredient: "Atorvastatin",
    description: "Statin medicine",
    prescriptionRequired: true,
  },
  {
    code: "MED-013",
    genericName: "Salbutamol",
    brandName: "Ventolin",
    dosage: "100 mcg",
    form: "Inhaler",
    activeIngredient: "Salbutamol",
    description: "Bronchodilator inhaler",
    prescriptionRequired: false,
  },
  {
    code: "MED-014",
    genericName: "Pantoprazole",
    brandName: "Pantocid",
    dosage: "40 mg",
    form: "Tablet",
    activeIngredient: "Pantoprazole",
    description: "Proton pump inhibitor",
    prescriptionRequired: false,
  },
  {
    code: "MED-015",
    genericName: "Esomeprazole",
    brandName: "Nexium",
    dosage: "40 mg",
    form: "Capsule",
    activeIngredient: "Esomeprazole",
    description: "Proton pump inhibitor",
    prescriptionRequired: false,
  },
  {
    code: "MED-016",
    genericName: "Aspirin",
    brandName: "Disprin",
    dosage: "75 mg",
    form: "Tablet",
    activeIngredient: "Acetylsalicylic Acid",
    description: "Low-dose antiplatelet medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-017",
    genericName: "Naproxen",
    brandName: "Naprosyn",
    dosage: "250 mg",
    form: "Tablet",
    activeIngredient: "Naproxen",
    description: "Non-steroidal anti-inflammatory medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-018",
    genericName: "Clotrimazole",
    brandName: "Canesten",
    dosage: "1%",
    form: "Cream",
    activeIngredient: "Clotrimazole",
    description: "Topical antifungal medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-019",
    genericName: "Fluconazole",
    brandName: "Diflucan",
    dosage: "150 mg",
    form: "Capsule",
    activeIngredient: "Fluconazole",
    description: "Antifungal medicine",
    prescriptionRequired: true,
  },
  {
    code: "MED-020",
    genericName: "Doxycycline",
    brandName: "Doxy",
    dosage: "100 mg",
    form: "Capsule",
    activeIngredient: "Doxycycline",
    description: "Tetracycline antibiotic",
    prescriptionRequired: true,
  },
  {
    code: "MED-021",
    genericName: "Ciprofloxacin",
    brandName: "Cipro",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Ciprofloxacin",
    description: "Fluoroquinolone antibiotic",
    prescriptionRequired: true,
  },
  {
    code: "MED-022",
    genericName: "Montelukast",
    brandName: "Singulair",
    dosage: "10 mg",
    form: "Tablet",
    activeIngredient: "Montelukast",
    description: "Medicine used in respiratory conditions",
    prescriptionRequired: true,
  },
  {
    code: "MED-023",
    genericName: "Furosemide",
    brandName: "Lasix",
    dosage: "40 mg",
    form: "Tablet",
    activeIngredient: "Furosemide",
    description: "Loop diuretic",
    prescriptionRequired: true,
  },
  {
    code: "MED-024",
    genericName: "Prednisolone",
    brandName: "Predni",
    dosage: "5 mg",
    form: "Tablet",
    activeIngredient: "Prednisolone",
    description: "Corticosteroid medicine",
    prescriptionRequired: true,
  },
  {
    code: "MED-025",
    genericName: "Hydrocortisone",
    brandName: "Cortaid",
    dosage: "1%",
    form: "Cream",
    activeIngredient: "Hydrocortisone",
    description: "Topical corticosteroid",
    prescriptionRequired: false,
  },
  {
    code: "MED-026",
    genericName: "Calcium Carbonate",
    brandName: "Caltrate",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Calcium Carbonate",
    description: "Calcium supplement medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-027",
    genericName: "Ferrous Sulfate",
    brandName: "Ferro",
    dosage: "200 mg",
    form: "Tablet",
    activeIngredient: "Ferrous Sulfate",
    description: "Iron supplement medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-028",
    genericName: "Mebendazole",
    brandName: "Vermox",
    dosage: "100 mg",
    form: "Tablet",
    activeIngredient: "Mebendazole",
    description: "Anthelmintic medicine",
    prescriptionRequired: false,
  },
  {
    code: "MED-029",
    genericName: "Domperidone",
    brandName: "Motilium",
    dosage: "10 mg",
    form: "Tablet",
    activeIngredient: "Domperidone",
    description: "Medicine used for nausea and vomiting",
    prescriptionRequired: true,
  },
  {
    code: "MED-030",
    genericName: "Ondansetron",
    brandName: "Zofran",
    dosage: "4 mg",
    form: "Tablet",
    activeIngredient: "Ondansetron",
    description: "Medicine used to prevent nausea and vomiting",
    prescriptionRequired: true,
  },
];

const basePrices: Record<string, number> = {
  Azithromycin: 320,
  Loratadine: 110,
  Diclofenac: 140,
  Metformin: 180,
  Amlodipine: 160,
  Losartan: 240,
  Atorvastatin: 350,
  Salbutamol: 750,
  Pantoprazole: 280,
  Esomeprazole: 310,
  Aspirin: 90,
  Naproxen: 190,
  Clotrimazole: 280,
  Fluconazole: 350,
  Doxycycline: 260,
  Ciprofloxacin: 300,
  Montelukast: 420,
  Furosemide: 120,
  Prednisolone: 150,
  Hydrocortisone: 320,
  "Calcium Carbonate": 250,
  "Ferrous Sulfate": 180,
  Mebendazole: 130,
  Domperidone: 220,
  Ondansetron: 280,
};

async function main() {
  console.log("\n========================================");
  console.log("Adding medicine catalogue...");
  console.log("========================================\n");

  const pharmacies = await prisma.pharmacy.findMany({
    where: {
      verificationStatus: "APPROVED",
    },
    orderBy: {
      city: "asc",
    },
  });

  console.log(`Approved pharmacies found: ${pharmacies.length}`);

  if (pharmacies.length === 0) {
    console.log(
      "\nNo approved pharmacies found."
    );

    console.log(
      "Medicines will still be added, but inventory cannot be created yet."
    );
  }

  let medicineCount = 0;
  let inventoryCount = 0;

  for (const medicineData of medicines) {
    const medicine = await prisma.medicine.upsert({
      where: {
        code: medicineData.code,
      },

      update: {
        genericName: medicineData.genericName,
        brandName: medicineData.brandName,
        dosage: medicineData.dosage,
        form: medicineData.form,
        activeIngredient: medicineData.activeIngredient,
        description: medicineData.description,
        prescriptionRequired:
          medicineData.prescriptionRequired,
        active: true,
      },

      create: {
        ...medicineData,
        active: true,
      },
    });

    medicineCount++;

    console.log(
      `? ${medicine.genericName} ${medicine.dosage} (${medicine.form})`
    );

    for (let i = 0; i < pharmacies.length; i++) {
      const pharmacy = pharmacies[i];

      const basePrice =
        basePrices[medicine.genericName] ?? 200;

      /*
       * Create realistic price differences between pharmacies.
       * The same medicine can therefore have a different price
       * in different cities/pharmacies.
       */
      const variation =
        ((i * 19 + medicineCount * 13) % 100) - 50;

      const price = Math.max(
        50,
        basePrice + variation
      );

      /*
       * Different stock levels make the inventory
       * and stock-status features more realistic.
       */
      const quantity =
        15 + ((i * 31 + medicineCount * 17) % 150);

      const reservedQuantity =
        medicineCount % 5 === 0
          ? Math.min(
              5,
              Math.floor(quantity / 5)
            )
          : 0;

      await prisma.inventory.upsert({
        where: {
          pharmacyId_medicineId: {
            pharmacyId: pharmacy.id,
            medicineId: medicine.id,
          },
        },

        update: {
          quantity,
          reservedQuantity,
          lowStockThreshold: 10,
          price: price.toFixed(2),
          isActive: true,
          lastRestockedAt: new Date(),
        },

        create: {
          pharmacyId: pharmacy.id,
          medicineId: medicine.id,
          quantity,
          reservedQuantity,
          lowStockThreshold: 10,
          price: price.toFixed(2),
          isActive: true,
          lastRestockedAt: new Date(),
        },
      });

      inventoryCount++;
    }
  }

  const totalMedicines =
    await prisma.medicine.count({
      where: {
        active: true,
      },
    });

  const totalInventory =
    await prisma.inventory.count();

  console.log("\n========================================");
  console.log("MEDICINE DATA COMPLETED");
  console.log("========================================");
  console.log(
    `New/updated medicines: ${medicineCount}`
  );
  console.log(
    `Inventory records processed: ${inventoryCount}`
  );
  console.log(
    `Total active medicines: ${totalMedicines}`
  );
  console.log(
    `Total inventory records: ${totalInventory}`
  );
  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\nERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
