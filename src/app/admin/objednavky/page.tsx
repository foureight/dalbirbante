import { isAdminAuthenticated } from "@/lib/auth";
import { AdminOrdersClient } from "@/components/admin-orders-client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const authenticated = await isAdminAuthenticated();
  return <AdminOrdersClient authenticated={authenticated} />;
}
