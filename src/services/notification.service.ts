import type {
  SessionPayload,
} from "@/features/auth/session";

import type {
  NotificationListInput,
} from "@/features/notifications/notification.schema";

import type {
  NotificationType,
} from "@/generated/prisma/enums";

import { AppError } from "@/lib/app-error";
import { prisma } from "@/lib/db";

type CreateNotificationInput = {
  userId: string;
  reservationId?: string | null;
  type: NotificationType;
  title: string;
  body: string;
};

export async function createNotification(
  input: CreateNotificationInput,
) {
  return prisma.notification.create({
    data: {
      userId: input.userId,

      reservationId:
        input.reservationId ??
        null,

      type: input.type,

      title: input.title,

      body: input.body,
    },
  });
}

export async function listNotifications(
  session: SessionPayload,
  input: NotificationListInput,
) {
  const skip =
    (input.page - 1) *
    input.pageSize;

  const where = {
    userId: session.userId,

    ...(input.unreadOnly
      ? {
          readAt: null,
        }
      : {}),
  };

  const [
    totalItems,
    unreadCount,
    notifications,
  ] = await prisma.$transaction([
    prisma.notification.count({
      where,
    }),

    prisma.notification.count({
      where: {
        userId:
          session.userId,

        readAt: null,
      },
    }),

    prisma.notification.findMany({
      where,

      select: {
        id: true,
        reservationId: true,
        type: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,

        reservation: {
          select: {
            id: true,
            status: true,
            pickupCode: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take:
        input.pageSize,
    }),
  ]);

  return {
    items: notifications,

    unreadCount,

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

export async function markNotificationRead(
  session: SessionPayload,
  notificationId: string,
) {
  const notification =
    await prisma.notification.findFirst({
      where: {
        id:
          notificationId,

        userId:
          session.userId,
      },

      select: {
        id: true,
        readAt: true,
      },
    });

  if (!notification) {
    throw new AppError(
      "NOTIFICATION_NOT_FOUND",
      "Notification was not found.",
      404,
    );
  }

  if (notification.readAt) {
    return prisma.notification.findUnique({
      where: {
        id:
          notification.id,
      },
    });
  }

  return prisma.notification.update({
    where: {
      id:
        notification.id,
    },

    data: {
      readAt:
        new Date(),
    },
  });
}