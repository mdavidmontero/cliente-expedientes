import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "../../../components/shared/adminSidebar/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full bg-[#F3F3F1]">
        <div className="px-3">
          <SidebarTrigger />
        </div>
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
