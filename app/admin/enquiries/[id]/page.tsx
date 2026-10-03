import { notFound } from "next/navigation";
import { EnquiryDetail } from "@/components/admin/admin-management";
import { getAdminEnquiry } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const enquiry = await getAdminEnquiry(id);
  if (!enquiry) notFound();
  return <EnquiryDetail initial={enquiry} />;
}
