import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "../src/generated/prisma/client";

import {
  VerificationStatus,
} from "../src/generated/prisma/enums";


const connectionString =
  process.env.DATABASE_URL;


if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing.",
  );
}


const adapter =
  new PrismaPg({
    connectionString,
  });


const prisma =
  new PrismaClient({
    adapter,
  });


/* ==========================================================
   DEMO MEDICINES
========================================================== */

const medicines = [
  {
    code: "MED-PARA-500",
    genericName: "Paracetamol",
    brandName: "MediFlux Para",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Paracetamol",
    description:
      "Demo paracetamol medicine entry.",
    prescriptionRequired: false,
    basePrice: 115,
  },

  {
    code: "MED-IBU-400",
    genericName: "Ibuprofen",
    brandName: "MediFlux Ibu",
    dosage: "400 mg",
    form: "Tablet",
    activeIngredient: "Ibuprofen",
    description:
      "Demo ibuprofen medicine entry.",
    prescriptionRequired: false,
    basePrice: 145,
  },

  {
    code: "MED-CET-10",
    genericName: "Cetirizine",
    brandName: "MediFlux Ceti",
    dosage: "10 mg",
    form: "Tablet",
    activeIngredient: "Cetirizine",
    description:
      "Demo cetirizine medicine entry.",
    prescriptionRequired: false,
    basePrice: 90,
  },

  {
    code: "MED-OME-20",
    genericName: "Omeprazole",
    brandName: "MediFlux Omez",
    dosage: "20 mg",
    form: "Capsule",
    activeIngredient: "Omeprazole",
    description:
      "Demo omeprazole medicine entry.",
    prescriptionRequired: false,
    basePrice: 180,
  },

  {
    code: "MED-MET-500",
    genericName: "Metformin",
    brandName: "MediFlux Met",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Metformin",
    description:
      "Demo metformin medicine entry.",
    prescriptionRequired: true,
    basePrice: 210,
  },

  {
    code: "MED-ATOR-20",
    genericName: "Atorvastatin",
    brandName: "MediFlux Ator",
    dosage: "20 mg",
    form: "Tablet",
    activeIngredient: "Atorvastatin",
    description:
      "Demo atorvastatin medicine entry.",
    prescriptionRequired: true,
    basePrice: 260,
  },

  {
    code: "MED-LOS-50",
    genericName: "Losartan",
    brandName: "MediFlux Los",
    dosage: "50 mg",
    form: "Tablet",
    activeIngredient: "Losartan",
    description:
      "Demo losartan medicine entry.",
    prescriptionRequired: true,
    basePrice: 225,
  },

  {
    code: "MED-AMOX-500",
    genericName: "Amoxicillin",
    brandName: "MediFlux Amox",
    dosage: "500 mg",
    form: "Capsule",
    activeIngredient: "Amoxicillin",
    description:
      "Demo amoxicillin medicine entry.",
    prescriptionRequired: true,
    basePrice: 330,
  },

  {
    code: "MED-AZI-500",
    genericName: "Azithromycin",
    brandName: "MediFlux Azi",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient: "Azithromycin",
    description:
      "Demo azithromycin medicine entry.",
    prescriptionRequired: true,
    basePrice: 475,
  },

  {
    code: "MED-SALB-2",
    genericName: "Salbutamol",
    brandName: "MediFlux Salbu",
    dosage: "2 mg",
    form: "Tablet",
    activeIngredient: "Salbutamol",
    description:
      "Demo salbutamol medicine entry.",
    prescriptionRequired: true,
    basePrice: 165,
  },

  {
    code: "MED-VITC-500",
    genericName: "Vitamin C",
    brandName: "MediFlux Vitamin C",
    dosage: "500 mg",
    form: "Tablet",
    activeIngredient:
      "Ascorbic Acid",
    description:
      "Demo vitamin C medicine entry.",
    prescriptionRequired: false,
    basePrice: 120,
  },

  {
    code: "MED-ORS-SACH",
    genericName:
      "Oral Rehydration Salts",
    brandName: "MediFlux ORS",
    dosage: "1 sachet",
    form: "Powder",
    activeIngredient:
      "Oral Rehydration Salts",
    description:
      "Demo oral rehydration salts.",
    prescriptionRequired: false,
    basePrice: 75,
  },
];


/* ==========================================================
   20 DUMMY PHARMACIES

   Coordinates are demo locations around Colombo and suburbs.
   Names are intentionally fictional.
========================================================== */

const pharmacies = [
  {
    slug: "mediflux-demo-fort",
    name: "MediCare Demo Pharmacy - Fort",
    licenceNumber: "DEMO-LIC-001",
    phone: "+94 11 700 0001",
    email: "fort@demo.mediflux.local",
    addressLine1: "12 Demo Street",
    city: "Colombo Fort",
    district: "Colombo",
    postalCode: "00100",
    latitude: 6.9344,
    longitude: 79.8428,
  },

  {
    slug: "mediflux-demo-pettah",
    name: "HealthPoint Demo Pharmacy - Pettah",
    licenceNumber: "DEMO-LIC-002",
    phone: "+94 11 700 0002",
    email: "pettah@demo.mediflux.local",
    addressLine1: "24 Market Demo Road",
    city: "Pettah",
    district: "Colombo",
    postalCode: "01100",
    latitude: 6.939,
    longitude: 79.855,
  },

  {
    slug: "mediflux-demo-colombo-02",
    name: "GreenCross Demo Pharmacy - Colombo 02",
    licenceNumber: "DEMO-LIC-003",
    phone: "+94 11 700 0003",
    email: "c02@demo.mediflux.local",
    addressLine1: "36 Union Demo Place",
    city: "Colombo 02",
    district: "Colombo",
    postalCode: "00200",
    latitude: 6.9189,
    longitude: 79.8543,
  },

  {
    slug: "mediflux-demo-kollupitiya",
    name: "CityMed Demo Pharmacy - Kollupitiya",
    licenceNumber: "DEMO-LIC-004",
    phone: "+94 11 700 0004",
    email: "kollupitiya@demo.mediflux.local",
    addressLine1: "48 Galle Demo Road",
    city: "Kollupitiya",
    district: "Colombo",
    postalCode: "00300",
    latitude: 6.9118,
    longitude: 79.8496,
  },

  {
    slug: "mediflux-demo-bambalapitiya",
    name: "CarePlus Demo Pharmacy - Bambalapitiya",
    licenceNumber: "DEMO-LIC-005",
    phone: "+94 11 700 0005",
    email: "bamba@demo.mediflux.local",
    addressLine1: "55 Demo Avenue",
    city: "Bambalapitiya",
    district: "Colombo",
    postalCode: "00400",
    latitude: 6.8936,
    longitude: 79.855,
  },

  {
    slug: "mediflux-demo-wellawatte",
    name: "LifeCare Demo Pharmacy - Wellawatte",
    licenceNumber: "DEMO-LIC-006",
    phone: "+94 11 700 0006",
    email: "wellawatte@demo.mediflux.local",
    addressLine1: "71 Demo Galle Road",
    city: "Wellawatte",
    district: "Colombo",
    postalCode: "00600",
    latitude: 6.8747,
    longitude: 79.8605,
  },

  {
    slug: "mediflux-demo-dehiwala",
    name: "NovaCare Demo Pharmacy - Dehiwala",
    licenceNumber: "DEMO-LIC-007",
    phone: "+94 11 700 0007",
    email: "dehiwala@demo.mediflux.local",
    addressLine1: "18 Demo Junction",
    city: "Dehiwala",
    district: "Colombo",
    postalCode: "10350",
    latitude: 6.8519,
    longitude: 79.8653,
  },

  {
    slug: "mediflux-demo-mount-lavinia",
    name: "MediHub Demo Pharmacy - Mount Lavinia",
    licenceNumber: "DEMO-LIC-008",
    phone: "+94 11 700 0008",
    email: "mount@demo.mediflux.local",
    addressLine1: "28 Station Demo Road",
    city: "Mount Lavinia",
    district: "Colombo",
    postalCode: "10370",
    latitude: 6.8396,
    longitude: 79.8653,
  },

  {
    slug: "mediflux-demo-nugegoda",
    name: "WellCare Demo Pharmacy - Nugegoda",
    licenceNumber: "DEMO-LIC-009",
    phone: "+94 11 700 0009",
    email: "nugegoda@demo.mediflux.local",
    addressLine1: "39 High Level Demo Road",
    city: "Nugegoda",
    district: "Colombo",
    postalCode: "10250",
    latitude: 6.872,
    longitude: 79.889,
  },

  {
    slug: "mediflux-demo-kirulapone",
    name: "HealthWay Demo Pharmacy - Kirulapone",
    licenceNumber: "DEMO-LIC-010",
    phone: "+94 11 700 0010",
    email: "kirulapone@demo.mediflux.local",
    addressLine1: "44 Demo High Level Road",
    city: "Kirulapone",
    district: "Colombo",
    postalCode: "00500",
    latitude: 6.8773,
    longitude: 79.875,
  },

  {
    slug: "mediflux-demo-narahenpita",
    name: "PrimeCare Demo Pharmacy - Narahenpita",
    licenceNumber: "DEMO-LIC-011",
    phone: "+94 11 700 0011",
    email: "narahenpita@demo.mediflux.local",
    addressLine1: "51 Demo Park Road",
    city: "Narahenpita",
    district: "Colombo",
    postalCode: "00500",
    latitude: 6.891,
    longitude: 79.8775,
  },

  {
    slug: "mediflux-demo-borella",
    name: "MediPoint Demo Pharmacy - Borella",
    licenceNumber: "DEMO-LIC-012",
    phone: "+94 11 700 0012",
    email: "borella@demo.mediflux.local",
    addressLine1: "68 Demo Cross Street",
    city: "Borella",
    district: "Colombo",
    postalCode: "00800",
    latitude: 6.9147,
    longitude: 79.8777,
  },

  {
    slug: "mediflux-demo-rajagiriya",
    name: "CareFirst Demo Pharmacy - Rajagiriya",
    licenceNumber: "DEMO-LIC-013",
    phone: "+94 11 700 0013",
    email: "rajagiriya@demo.mediflux.local",
    addressLine1: "80 Parliament Demo Road",
    city: "Rajagiriya",
    district: "Colombo",
    postalCode: "10107",
    latitude: 6.9091,
    longitude: 79.8943,
  },

  {
    slug: "mediflux-demo-battaramulla",
    name: "MediZone Demo Pharmacy - Battaramulla",
    licenceNumber: "DEMO-LIC-014",
    phone: "+94 11 700 0014",
    email: "battaramulla@demo.mediflux.local",
    addressLine1: "92 Demo Main Street",
    city: "Battaramulla",
    district: "Colombo",
    postalCode: "10120",
    latitude: 6.9022,
    longitude: 79.9196,
  },

  {
    slug: "mediflux-demo-kotte",
    name: "HealthSquare Demo Pharmacy - Kotte",
    licenceNumber: "DEMO-LIC-015",
    phone: "+94 11 700 0015",
    email: "kotte@demo.mediflux.local",
    addressLine1: "15 Demo Castle Road",
    city: "Sri Jayawardenepura Kotte",
    district: "Colombo",
    postalCode: "10100",
    latitude: 6.8905,
    longitude: 79.9015,
  },

  {
    slug: "mediflux-demo-maharagama",
    name: "MedStar Demo Pharmacy - Maharagama",
    licenceNumber: "DEMO-LIC-016",
    phone: "+94 11 700 0016",
    email: "maharagama@demo.mediflux.local",
    addressLine1: "27 Demo High Level Road",
    city: "Maharagama",
    district: "Colombo",
    postalCode: "10280",
    latitude: 6.848,
    longitude: 79.9265,
  },

  {
    slug: "mediflux-demo-kaduwela",
    name: "CareLine Demo Pharmacy - Kaduwela",
    licenceNumber: "DEMO-LIC-017",
    phone: "+94 11 700 0017",
    email: "kaduwela@demo.mediflux.local",
    addressLine1: "31 Demo Main Road",
    city: "Kaduwela",
    district: "Colombo",
    postalCode: "10640",
    latitude: 6.935,
    longitude: 79.984,
  },

  {
    slug: "mediflux-demo-malabe",
    name: "MediBridge Demo Pharmacy - Malabe",
    licenceNumber: "DEMO-LIC-018",
    phone: "+94 11 700 0018",
    email: "malabe@demo.mediflux.local",
    addressLine1: "43 Demo New Kandy Road",
    city: "Malabe",
    district: "Colombo",
    postalCode: "10115",
    latitude: 6.9063,
    longitude: 79.969,
  },

  {
    slug: "mediflux-demo-nawala",
    name: "HealthLink Demo Pharmacy - Nawala",
    licenceNumber: "DEMO-LIC-019",
    phone: "+94 11 700 0019",
    email: "nawala@demo.mediflux.local",
    addressLine1: "54 Demo Nawala Road",
    city: "Nawala",
    district: "Colombo",
    postalCode: "11222",
    latitude: 6.8908,
    longitude: 79.8837,
  },

  {
    slug: "mediflux-demo-thimbirigasyaya",
    name: "MediCentral Demo Pharmacy - Thimbirigasyaya",
    licenceNumber: "DEMO-LIC-020",
    phone: "+94 11 700 0020",
    email: "thimbirigasyaya@demo.mediflux.local",
    addressLine1: "65 Demo Avenue",
    city: "Thimbirigasyaya",
    district: "Colombo",
    postalCode: "00500",
    latitude: 6.8955,
    longitude: 79.868,
  },
];


/* ==========================================================
   SEED
========================================================== */

async function main() {

  console.log(
    "Creating demo medicine catalogue...",
  );


  const medicineRecords = [];


  for (
    const medicine of medicines
  ) {

   const medicineData = {
  code: medicine.code,

  genericName:
    medicine.genericName,

  brandName:
    medicine.brandName,

  dosage:
    medicine.dosage,

  form:
    medicine.form,

  activeIngredient:
    medicine.activeIngredient,

  description:
    medicine.description,

  prescriptionRequired:
    medicine.prescriptionRequired,
};

    const record =
      await prisma.medicine.upsert({

        where: {
          code:
            medicine.code,
        },

        update: {
          ...medicineData,

          active: true,
        },

        create: {
          ...medicineData,

          active: true,
        },
      });


    medicineRecords.push(
      record,
    );
  }


  console.log(
    "Creating 20 demo pharmacies...",
  );


  for (
    let pharmacyIndex = 0;
    pharmacyIndex <
    pharmacies.length;
    pharmacyIndex++
  ) {

    const pharmacyData =
      pharmacies[
        pharmacyIndex
      ];


    const pharmacy =
      await prisma.pharmacy.upsert({

        where: {
          slug:
            pharmacyData.slug,
        },

        update: {
          ...pharmacyData,

          verificationStatus:
            VerificationStatus.APPROVED,

          verifiedAt:
            new Date(),
        },

        create: {
          ...pharmacyData,

          verificationStatus:
            VerificationStatus.APPROVED,

          verifiedAt:
            new Date(),
        },
      });


    /*
      Every demo pharmacy receives
      every demo medicine.

      That means searching Paracetamol
      can display all 20 pharmacies
      on the map.
    */

    for (
      let medicineIndex = 0;
      medicineIndex <
      medicineRecords.length;
      medicineIndex++
    ) {

      const medicineRecord =
        medicineRecords[
          medicineIndex
        ];


      const medicineDefinition =
        medicines[
          medicineIndex
        ];


      const quantity =
        12 +
        (
          (
            pharmacyIndex *
            7
          ) +
          (
            medicineIndex *
            11
          )
        ) %
          55;


      const price =
        medicineDefinition
          .basePrice +
        (
          (
            pharmacyIndex *
            5
          ) +
          (
            medicineIndex *
            3
          )
        ) %
          25;


      await prisma.inventory.upsert({

        where: {
          pharmacyId_medicineId: {
            pharmacyId:
              pharmacy.id,

            medicineId:
              medicineRecord.id,
          },
        },

        update: {
          quantity,

          reservedQuantity: 0,

          price:
            price.toFixed(
              2,
            ),

          lowStockThreshold:
            5,

          isActive: true,

          lastRestockedAt:
            new Date(),
        },

        create: {
          pharmacyId:
            pharmacy.id,

          medicineId:
            medicineRecord.id,

          quantity,

          reservedQuantity: 0,

          price:
            price.toFixed(
              2,
            ),

          lowStockThreshold:
            5,

          isActive: true,

          lastRestockedAt:
            new Date(),
        },
      });
    }
  }


  const pharmacyCount =
    await prisma.pharmacy.count();


  const medicineCount =
    await prisma.medicine.count();


  const inventoryCount =
    await prisma.inventory.count();


  console.log(
    "Demo map seed completed.",
  );


  console.log({
    pharmacyCount,
    medicineCount,
    inventoryCount,
  });
}


main()
  .catch(
    (error) => {

      console.error(
        error,
      );

      process.exit(1);
    },
  )
  .finally(
    async () => {

      await prisma.$disconnect();

    },
  );