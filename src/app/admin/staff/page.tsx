import { db } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Badge, Card, PageHeader, Table, Td } from "@/components/admin/ui";
import StaffRow from "@/components/admin/StaffRow";
import InviteStaffForm from "@/components/admin/InviteStaffForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const me = await requireRole("OWNER");
  const users = await db.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] });

  return (
    <>
      <PageHeader
        title="Staff"
        subtitle="Owners manage people. Admins run the store. Staff handle orders and stock."
      />

      <div className="space-y-5">
        <Table head={["Person", "Role", "Last signed in", "Status", ""]}>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-neutral-50">
              <Td>
                <span className="block font-medium">{user.name}</span>
                <span className="text-[12px] text-neutral-500">{user.email}</span>
              </Td>
              <Td>
                <StaffRow
                  userId={user.id}
                  role={user.role}
                  isActive={user.isActive}
                  isSelf={user.id === me.id}
                  control="role"
                />
              </Td>
              <Td className="text-neutral-500">
                {user.lastLoginAt
                  ? user.lastLoginAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "never"}
              </Td>
              <Td>
                {user.isActive ? <Badge tone="green">active</Badge> : <Badge tone="neutral">disabled</Badge>}
              </Td>
              <Td className="text-right">
                <StaffRow
                  userId={user.id}
                  role={user.role}
                  isActive={user.isActive}
                  isSelf={user.id === me.id}
                  control="active"
                />
              </Td>
            </tr>
          ))}
        </Table>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Add someone" description="They sign in with the password you set here.">
            <InviteStaffForm />
          </Card>
          <Card title="Your password">
            <ChangePasswordForm />
          </Card>
        </div>
      </div>
    </>
  );
}
