import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardPage } from "@/pages/dashboard-page";

export default function Layout() {
  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Right Content Area */}
        <main className="w-full flex-1 p-4 dark:bg-zinc-900">
          <SidebarTrigger className="cursor-pointer" />

          <DashboardPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
