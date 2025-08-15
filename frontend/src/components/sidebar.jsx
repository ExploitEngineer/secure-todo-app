import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardPage } from "@/pages/dashboard-page";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export default function Layout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect_error", (err) => {
      toast.error(`Socket connection failed: ${err.message}`);
    });

    socketRef.current.on("todosUpdated", (updatedTodos) => {
      setTodos(updatedTodos);
      toast.success("Todos updated in real-time");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedUser || !socketRef.current) return;
    socketRef.current.emit("joinUserRoom", selectedUser.id);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveUserRoom", selectedUser.id);
      }
    };
  }, [selectedUser]);

  const loadMyTodos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/todos", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Response error:", res.statusText);
      }
      const data = await res.json();
      setTodos(data);
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
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        toast.error("Failed to fetch user todos");
        setTodos([]);
        return;
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      toast.error("Failed to fetch user todos");
      console.error("handleUserSelect error:", err);
      setTodos([]);
    }
  };

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full">
        {/* Left Sidebar */}
        <AppSidebar
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />

        {/* Right Content Area */}
        <main className="w-full flex-1 p-4 dark:bg-zinc-900">
          <SidebarTrigger className="cursor-pointer" />
          <DashboardPage todos={todos} setTodos={setTodos} />
        </main>
      </div>
    </SidebarProvider>
  );
}
