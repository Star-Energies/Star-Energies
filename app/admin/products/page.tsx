import { ProductsManager } from "@/components/admin/catalogue-management";
import { getAdminProducts } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminProductsPage() {
  await requireAdminPage();
  return <ProductsManager products={await getAdminProducts()} />;
}
