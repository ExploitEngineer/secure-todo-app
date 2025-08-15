import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Users", url: "#", icon: User },
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

const workflows = ["Personal", "Work", "Project A", "Project B", "Archived"];

export function AppSidebar({ selectedUser, onUserSelect }) {
  const { theme } = useTheme();

  const [users, setUsers] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);
  const [loggedInUser, setLoggedInUser] = useState({ username: "", email: "" });

  const fetchUsername = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch username");
      const data = await res.json();
      setLoggedInUser({ username: data.username, email: data.email });
    } catch (err) {
      console.error(err.message);
      setLoggedInUser({ username: "", email: "" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      if (!res.ok) {
        toast.error("failed fetching users");
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("failed to fetch", err.message);
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchUsers();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="gap-4 py-4 dark:bg-zinc-900 dark:bg-linear-0">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={`/assets/images/${theme === "dark" ? "dark-user" : "user"}.gif`}
            className="h-12 w-12 rounded-full border-2 border-black object-cover p-1 shadow-sm dark:border-white"
            alt="user"
          />
          <h3
            className="max-w-[160px] truncate text-lg font-semibold tracking-wide"
            title={loggedInUser.username}
          >
            {loggedInUser.username || "Loading..."}
          </h3>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 text-base font-bold">
            Workflows
          </SidebarGroupLabel>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mb-4 w-full cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-left text-sm font-medium text-white hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {selectedWorkflow}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Choose Workflow</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workflows.map((wf) => (
                <DropdownMenuItem
                  key={wf}
                  onSelect={() => setSelectedWorkflow(wf)}
                  className={
                    wf === selectedWorkflow ? "font-semibold text-blue-500" : ""
                  }
                >
                  {wf}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SidebarGroupLabel className="mb-1 text-base font-bold">
            Users
          </SidebarGroupLabel>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-left text-sm font-medium text-white hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {selectedUser?.username || "select user"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuSeparator />
              {users.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onSelect={() => onUserSelect && onUserSelect(user)}
                  className={
                    user.id === selectedUser?.id
                      ? "font-semibold text-blue-500"
                      : ""
                  }
                >
                  {user.email === loggedInUser.email ? (
                    <Badge className="bg-green-600">{user.username}</Badge>
                  ) : (
                    user.username
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
