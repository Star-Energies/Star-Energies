import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  return <AdminDashboard {...(await getAdminDashboardData())} />;
}
