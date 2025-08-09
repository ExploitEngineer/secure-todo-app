import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { RotateCw } from "lucide-react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";

export function AllUsers() {
  const [users, setUsers] = useState([]);
  const iconRef = useRef();

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:4000/api/users");
    if (!res.ok) {
      toast.error("Failed fetching users");
      throw new Error("Error fetching users");
    }
    const data = await res.json();
    console.log("Users:", data);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();

    const socket = io("http://localhost:4000", {
      auth: {
        token: "REPLACE_WITH_REAL_TOKEN",
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected, id =", socket.id);
    });
  }, []);

  const handleClick = () => {
    iconRef.current.classList.add("animate-spin");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCollab = (userId) => {
    console.log(userId);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-zinc-900 to-zinc-800 px-6 py-8">
      <div className="mb-10 flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Users List
        </h1>
        <Link to="/dashboard">
          <Button className="cursor-pointer rounded-lg bg-amber-600 px-5 py-5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-500">
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 relative min-h-[400px] w-full max-w-6xl overflow-y-auto rounded-2xl bg-zinc-800/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex w-full items-center justify-end">
          <Button onClick={handleClick} className="me-4 cursor-pointer">
            <RotateCw ref={iconRef} color="white" strokeWidth={1.5} />
          </Button>
        </div>
        <ul className="mt-4 flex w-full flex-col gap-4">
          {users.length === 0 ? (
            <p className="py-10 text-center text-lg font-light text-white">
              No users yet...
            </p>
          ) : (
            users.map((user, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-xl bg-zinc-700/60 p-4 shadow-sm transition-colors duration-200 hover:bg-zinc-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/images/user.jpg"
                    className="h-12 w-12 rounded-full border border-zinc-500 object-cover shadow-sm"
                    alt="user"
                  />
                  <h3 className="text-base font-medium tracking-wide text-white">
                    {user.username}
                  </h3>
                </div>
                <Button
                  onClick={handleCollab(user.id)}
                  className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-500"
                >
                  Collab
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
