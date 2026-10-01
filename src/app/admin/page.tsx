import { getContent } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminClient } from "@/components/admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [content, authenticated] = await Promise.all([
    getContent(),
    isAdminAuthenticated(),
  ]);

  return <AdminClient initial={content} authenticated={authenticated} />;
}
