import { OrderStatus } from "@/generated/prisma/enums";

export function statusTone(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PAID:
      return "green" as const;
    case OrderStatus.FULFILLED:
      return "blue" as const;
    case OrderStatus.PENDING:
      return "amber" as const;
    case OrderStatus.CANCELLED:
    case OrderStatus.REFUNDED:
      return "red" as const;
    default:
      return "neutral" as const;
  }
}

export const ORDER_STATUSES = Object.values(OrderStatus);
