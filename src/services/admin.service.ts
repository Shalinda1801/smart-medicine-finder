import type { Prisma } from "@/generated/prisma/client";

import type {
  SessionPayload,
} from "@/features/auth/session";

import type {
  AdminPharmacyListInput,
  AdminUserListInput,
  AuditLogListInput,
  PharmacyVerificationInput,
  ReviewDocumentInput,
  UpdateUserStatusInput,
} from "@/features/admin/admin.schema";

import {
  DocumentReviewStatus,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

function requireAdmin(
  session: SessionPayload,
) {
  if (session.role !== UserRole.ADMIN) {
    throw new AppError(
      "ADMIN_REQUIRED",
      "Administrator access is required.",
      403,
    );
  }
}

export async function listAdminPharmacies(
  session: SessionPayload,
  input: AdminPharmacyListInput,
) {
  requireAdmin(session);

  const skip =
    (input.page - 1) *
    input.pageSize;

  const where: Prisma.PharmacyWhereInput = {
    ...(input.status
      ? {
          verificationStatus:
            input.status as VerificationStatus,
        }
      : {}),

    ...(input.q
      ? {
          OR: [
            {
              name: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              licenceNumber: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: input.q,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [totalItems, pharmacies] =
    await prisma.$transaction([
      prisma.pharmacy.count({
        where,
      }),

      prisma.pharmacy.findMany({
        where,

        select: {
          id: true,
          slug: true,
          name: true,
          licenceNumber: true,
          phone: true,
          email: true,

          addressLine1: true,
          addressLine2: true,
          city: true,
          district: true,
          postalCode: true,

          latitude: true,
          longitude: true,

          verificationStatus: true,
          verifiedAt: true,
          rejectionReason: true,

          createdAt: true,
          updatedAt: true,

          members: {
            select: {
              id: true,
              memberRole: true,

              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  status: true,
                },
              },
            },
          },

          verificationDocuments: {
            select: {
              id: true,
              documentType: true,
              originalName: true,
              mimeType: true,
              sizeBytes: true,
              storageProvider: true,
              storageKey: true,
              reviewStatus: true,
              reviewReason: true,
              reviewedAt: true,
              createdAt: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: input.pageSize,
      }),
    ]);

  return {
    items: pharmacies,

    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      totalItems,

      totalPages: Math.max(
        Math.ceil(
          totalItems /
            input.pageSize,
        ),
        1,
      ),
    },
  };
}

export async function updatePharmacyVerification(
  session: SessionPayload,
  pharmacyId: string,
  input: PharmacyVerificationInput,
) {
  requireAdmin(session);

  const pharmacy =
    await prisma.pharmacy.findUnique({
      where: {
        id: pharmacyId,
      },

      select: {
        id: true,
        name: true,
        verificationStatus: true,
      },
    });

  if (!pharmacy) {
    throw new AppError(
      "PHARMACY_NOT_FOUND",
      "Pharmacy was not found.",
      404,
    );
  }

  const nextStatus =
    input.status as VerificationStatus;

  return prisma.$transaction(
    async (tx) => {
      const updated =
        await tx.pharmacy.update({
          where: {
            id: pharmacy.id,
          },

          data: {
            verificationStatus:
              nextStatus,

            verifiedAt:
              nextStatus ===
              VerificationStatus.APPROVED
                ? new Date()
                : undefined,

            rejectionReason:
              nextStatus ===
              VerificationStatus.APPROVED
                ? null
                : input.reason ?? null,
          },

          select: {
            id: true,
            slug: true,
            name: true,
            licenceNumber: true,
            verificationStatus: true,
            verifiedAt: true,
            rejectionReason: true,
            updatedAt: true,
          },
        });

      await tx.auditLog.create({
        data: {
          actorId:
            session.userId,

          action:
            "PHARMACY_VERIFICATION_UPDATED",

          entityType:
            "Pharmacy",

          entityId:
            pharmacy.id,

          metadata: {
            previousStatus:
              pharmacy.verificationStatus,

            newStatus:
              nextStatus,

            reason:
              input.reason ?? null,
          },
        },
      });

      return updated;
    },
  );
}

export async function listAdminUsers(
  session: SessionPayload,
  input: AdminUserListInput,
) {
  requireAdmin(session);

  const skip =
    (input.page - 1) *
    input.pageSize;

  const where: Prisma.UserWhereInput = {
    ...(input.role
      ? {
          role:
            input.role as UserRole,
        }
      : {}),

    ...(input.status
      ? {
          status:
            input.status as UserStatus,
        }
      : {}),

    ...(input.q
      ? {
          OR: [
            {
              name: {
                contains: input.q,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: input.q,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [totalItems, users] =
    await prisma.$transaction([
      prisma.user.count({
        where,
      }),

      prisma.user.findMany({
        where,

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          pharmacyMemberships: {
            select: {
              id: true,
              memberRole: true,

              pharmacy: {
                select: {
                  id: true,
                  name: true,
                  verificationStatus: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: input.pageSize,
      }),
    ]);

  return {
    items: users,

    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      totalItems,

      totalPages: Math.max(
        Math.ceil(
          totalItems /
            input.pageSize,
        ),
        1,
      ),
    },
  };
}

export async function updateUserStatus(
  session: SessionPayload,
  userId: string,
  input: UpdateUserStatusInput,
) {
  requireAdmin(session);

  if (userId === session.userId) {
    throw new AppError(
      "CANNOT_CHANGE_OWN_STATUS",
      "You cannot change the status of your own administrator account.",
      409,
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User was not found.",
      404,
    );
  }

  const nextStatus =
    input.status as UserStatus;

  return prisma.$transaction(
    async (tx) => {
      const updated =
        await tx.user.update({
          where: {
            id: user.id,
          },

          data: {
            status: nextStatus,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
          },
        });

      await tx.auditLog.create({
        data: {
          actorId:
            session.userId,

          action:
            "USER_STATUS_UPDATED",

          entityType:
            "User",

          entityId:
            user.id,

          metadata: {
            previousStatus:
              user.status,

            newStatus:
              nextStatus,
          },
        },
      });

      return updated;
    },
  );
}

export async function reviewVerificationDocument(
  session: SessionPayload,
  documentId: string,
  input: ReviewDocumentInput,
) {
  requireAdmin(session);

  const document =
    await prisma.verificationDocument.findUnique({
      where: {
        id: documentId,
      },

      select: {
        id: true,
        pharmacyId: true,
        documentType: true,
        originalName: true,
        reviewStatus: true,
      },
    });

  if (!document) {
    throw new AppError(
      "DOCUMENT_NOT_FOUND",
      "Verification document was not found.",
      404,
    );
  }

  const nextStatus =
    input.status as DocumentReviewStatus;

  return prisma.$transaction(
    async (tx) => {
      const updated =
        await tx.verificationDocument.update({
          where: {
            id: document.id,
          },

          data: {
            reviewStatus:
              nextStatus,

            reviewReason:
              nextStatus ===
              DocumentReviewStatus.APPROVED
                ? null
                : input.reason ?? null,

            reviewedById:
              session.userId,

            reviewedAt:
              new Date(),
          },

          select: {
            id: true,
            pharmacyId: true,
            documentType: true,
            originalName: true,
            reviewStatus: true,
            reviewReason: true,
            reviewedById: true,
            reviewedAt: true,
            updatedAt: true,
          },
        });

      await tx.auditLog.create({
        data: {
          actorId:
            session.userId,

          action:
            "VERIFICATION_DOCUMENT_REVIEWED",

          entityType:
            "VerificationDocument",

          entityId:
            document.id,

          metadata: {
            pharmacyId:
              document.pharmacyId,

            previousStatus:
              document.reviewStatus,

            newStatus:
              nextStatus,

            reason:
              input.reason ?? null,
          },
        },
      });

      return updated;
    },
  );
}

export async function listAuditLogs(
  session: SessionPayload,
  input: AuditLogListInput,
) {
  requireAdmin(session);

  const skip =
    (input.page - 1) *
    input.pageSize;

  const [
    totalItems,
    auditLogs,
  ] = await prisma.$transaction([
    prisma.auditLog.count(),

    prisma.auditLog.findMany({
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        metadata: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,

        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: input.pageSize,
    }),
  ]);

  return {
    items: auditLogs,

    pagination: {
      page: input.page,
      pageSize:
        input.pageSize,

      totalItems,

      totalPages: Math.max(
        Math.ceil(
          totalItems /
            input.pageSize,
        ),
        1,
      ),
    },
  };
}