"use client";

import { useTransition } from "react";
import { setStaffActive, setStaffRole } from "@/app/admin/actions/staff";
import { Role } from "@/generated/prisma/enums";

export default function StaffRow({
  userId,
  role,
  isActive,
  isSelf,
  control,
}: {
  userId: string;
  role: Role;
  isActive: boolean;
  isSelf: boolean;
  control: "role" | "active";
}) {
  const [pending, start] = useTransition();

  if (control === "role") {
    if (isSelf) return <span className="text-[13px] text-neutral-500">{role.toLowerCase()} (you)</span>;
    return (
      <select
        value={role}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Role;
          start(() => void setStaffRole(userId, next));
        }}
        className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-[13px]"
      >
        {Object.values(Role).map((option) => (
          <option key={option} value={option}>
            {option.toLowerCase()}
          </option>
        ))}
      </select>
    );
  }

  if (isSelf) return null;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => void setStaffActive(userId, !isActive))}
      className="text-[13px] text-neutral-600 hover:underline"
    >
      {isActive ? "Deactivate" : "Reactivate"}
    </button>
  );
}
