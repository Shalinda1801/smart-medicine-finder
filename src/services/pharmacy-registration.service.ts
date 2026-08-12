import bcrypt from "bcryptjs";

import {
  PharmacyMemberRole,
  UserRole,
  VerificationStatus,
} from "@/generated/prisma/enums";

import type {
  PharmacyRegistrationInput,
} from "@/features/pharmacy/pharmacy-registration.schema";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

/* =========================================================
   CREATE URL-SAFE PHARMACY SLUG
========================================================= */

function createPharmacySlug(
  pharmacyName: string,
) {
  const base = pharmacyName
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );

  return `${base}-${Date.now().toString(36)}`;
}

/* =========================================================
   REGISTER PHARMACY + OWNER
========================================================= */

export async function registerPharmacy(
  input:
    PharmacyRegistrationInput,
) {
  const email =
    input.email
      .trim()
      .toLowerCase();

  /* -------------------------------------------------------
     Check email
  ------------------------------------------------------- */

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new AppError(
      "EMAIL_ALREADY_EXISTS",
      "An account already exists with this email.",
      409,
    );
  }

  /* -------------------------------------------------------
     Check licence
  ------------------------------------------------------- */

  const existingLicence =
    await prisma.pharmacy.findUnique({
      where: {
        licenceNumber:
          input.licenceNumber,
      },
    });

  if (existingLicence) {
    throw new AppError(
      "PHARMACY_LICENCE_EXISTS",
      "A pharmacy is already registered with this licence number.",
      409,
    );
  }

  /* -------------------------------------------------------
     Hash password
  ------------------------------------------------------- */

  const passwordHash =
    await bcrypt.hash(
      input.password,
      12,
    );

  /* -------------------------------------------------------
     Transaction

     Either EVERYTHING is created,
     or NOTHING is created.
  ------------------------------------------------------- */

  return prisma.$transaction(
    async (tx) => {
      /* CREATE STAFF USER */

      const user =
        await tx.user.create({
          data: {
            name:
              input.ownerName,

            email,

            passwordHash,

            role:
              UserRole.PHARMACY_STAFF,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

      /* CREATE PHARMACY */

      const pharmacy =
        await tx.pharmacy.create({
          data: {
            slug:
              createPharmacySlug(
                input.pharmacyName,
              ),

            name:
              input.pharmacyName,

            licenceNumber:
              input.licenceNumber,

            phone:
              input.phone,

            email,

            addressLine1:
              input.addressLine1,

            addressLine2:
              input.addressLine2,

            city:
              input.city,

            district:
              input.district,

            postalCode:
              input.postalCode,

            latitude:
              input.latitude,

            longitude:
              input.longitude,

            /*
              IMPORTANT:

              Never automatically approve
              a real pharmacy.
            */

            verificationStatus:
              VerificationStatus.PENDING,
          },
        });

      /* CONNECT OWNER TO PHARMACY */

      await tx.pharmacyMember.create({
        data: {
          userId:
            user.id,

          pharmacyId:
            pharmacy.id,

          memberRole:
            PharmacyMemberRole.OWNER,
        },
      });

      return {
        user,

        pharmacy: {
          id:
            pharmacy.id,

          name:
            pharmacy.name,

          city:
            pharmacy.city,

          latitude:
            pharmacy.latitude,

          longitude:
            pharmacy.longitude,

          verificationStatus:
            pharmacy.verificationStatus,
        },

        message:
          "Pharmacy registration submitted successfully. Administrator approval is required before the pharmacy becomes visible to customers.",
      };
    },
  );
}