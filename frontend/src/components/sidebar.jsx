import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardPage } from "@/pages/dashboard-page";
import toast from "react-hot-toast";

export default function Layout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);

  const loadMyTodos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/todos", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load my todos:", err);
      setTodos([]);
    }
  };

  useEffect(() => {
    loadMyTodos();
  }, []);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(
        `http://localhost:4000/api/users/${user.id}/todos`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch user todos");
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch user todos");
      console.error("handleUserSelect error:", err);
      setTodos([]);
    }
  };

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full">
        <AppSidebar
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />
        <main className="w-full flex-1 p-4 dark:bg-zinc-900">
          <SidebarTrigger className="cursor-pointer" />
          <DashboardPage
            todos={todos}
            setTodos={setTodos}
            selectedUser={selectedUser}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
