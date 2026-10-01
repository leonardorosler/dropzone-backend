import { AdminGuard } from "@/components/AdminGuard";
import { AdminNav } from "@/components/AdminNav";
export default function AdminLayout({children}:{children:React.ReactNode}){
  return <AdminGuard><div className="admin-shell"><AdminNav/><main className="admin-content">{children}</main></div></AdminGuard>;
}
