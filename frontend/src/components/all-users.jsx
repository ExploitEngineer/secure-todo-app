import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { RotateCw } from "lucide-react";

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
  }, []);

  const handleClick = () => {
    iconRef.current.classList.add("animate-spin");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-zinc-900 to-zinc-800 py-8 px-6">
      <div className="w-full flex justify-between items-center max-w-6xl mb-10">
        <h1 className="text-white font-bold text-3xl tracking-tight">
          Users List
        </h1>
        <Link to="/dashboard">
          <button className="text-white text-sm font-medium rounded-lg py-3 px-5 bg-amber-600 hover:bg-amber-500 transition-all duration-200 shadow-md">
            Dashboard
          </button>
        </Link>
      </div>

      <div className="relative bg-zinc-800/80 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-6xl min-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 p-6">
        <div className="w-full flex items-center justify-end">
          <button onClick={handleClick} className="me-4 cursor-pointer">
            <RotateCw ref={iconRef} color="white" strokeWidth={1.5} />
          </button>
        </div>
        <ul className="w-full flex flex-col gap-4 mt-4">
          {users.length === 0 ? (
            <p className="text-white text-center text-lg font-light py-10">
              No users yet...
            </p>
          ) : (
            users.map((user, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-700/60 hover:bg-zinc-700 transition-colors duration-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/images/user.jpg"
                    className="w-12 h-12 rounded-full border border-zinc-500 shadow-sm object-cover"
                    alt="user"
                  />
                  <h3 className="text-white text-base font-medium tracking-wide">
                    {user.username}
                  </h3>
                </div>
                <button
                  onClick={() => console.log(user.id)}
                  className="py-2 px-6 bg-blue-600 hover:bg-blue-500 transition-colors duration-200 text-white font-medium text-sm rounded-lg cursor-pointer shadow-md"
                >
                  Collab
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
