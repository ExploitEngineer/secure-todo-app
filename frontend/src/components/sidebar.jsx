import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardPage } from "@/pages/dashboard-page";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Right Content Area */}
        <main className="flex-1 p-4">
          <SidebarTrigger />
          <DashboardPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
