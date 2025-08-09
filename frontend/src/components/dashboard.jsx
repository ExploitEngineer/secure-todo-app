import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SquarePen, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [todo, setTodo] = useState([]);
  const [value, setValue] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUsername(data.username);
    } catch (err) {
      console.error(err.message);
      setUsername("");
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:4000/todos", {
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to fetch todos!");
        throw new Error(`Error fetching todos: ${response.statusText}`);
      }

      const data = await response.json();
      toast.success("Todos fetched");
      setTodo(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTodos();
  }, []);

  const handleInputChange = (e) => setValue(e.target.value);

  const handleSetTodo = async () => {
    try {
      const res = await fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: value }),
      });

      if (!res.ok) throw new Error(`Error adding todo: ${res.statusText}`);

      const newTodo = await res.json();
      setTodo([newTodo, ...todo]);
      setValue("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleCheck = (index) => {
    const updatedTodos = todo.map((item, idx) =>
      index === idx ? { ...item, checked: !item.checked } : item
    );
    setTodo(updatedTodos);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Error logging out: ${response.statusText}`);
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  const handleDelete = async (idx) => {
    try {
      const res = await fetch(`http://localhost:4000/todos/${idx}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error deleting todo: ${res.statusText}`);

      setTodo(todo.filter((item) => item.id !== idx));
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  const handleTodoUpdate = async (idx) => {
    const newTitle = prompt("Enter new title");
    if (!newTitle) return;

    try {
      const res = await fetch(`http://localhost:4000/todos/${idx}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error(`Failed to update todo: ${res.statusText}`);

      const updateTodo = await res.json();
      setTodo((prevTodos) =>
        prevTodos.map((item) => (item.id === idx ? updateTodo : item))
      );
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 p-10 flex flex-col items-center">
      <div className="absolute left-5 top-5 flex items-center gap-3">
        <img
          src="/assets/images/user.jpg"
          className="w-12 h-12 rounded-full border border-zinc-600 shadow-sm object-cover"
          alt="user"
        />
        <h3 className="text-white text-base font-semibold tracking-wide">
          {username || "Loading..."}
        </h3>
      </div>

      <Link to="/users">
        <button className="absolute right-5 top-5 text-white text-sm font-medium rounded-lg py-3 px-4 bg-amber-600 cursor-pointer hover:bg-amber-500 transition-all duration-200 shadow-md">
          All users
        </button>
      </Link>

      <h1 className="text-white text-center font-bold text-3xl mt-16">
        Welcome to Dashboard 👋
      </h1>

      <div className="mt-8 w-full max-w-md flex gap-3">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1 py-3 px-4 rounded-lg outline-none text-white bg-zinc-700/80 border border-blue-600 placeholder:text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task..."
        />
        <button
          onClick={handleSetTodo}
          className="bg-blue-600 hover:bg-blue-500 transition-colors duration-200 text-white text-sm font-medium rounded-lg py-3 px-5 shadow-md cursor-pointer"
        >
          Add Todo
        </button>
      </div>

      <div className="w-full max-w-md mt-10 bg-zinc-800/80 rounded-lg shadow-lg p-6">
        <h2 className="text-zinc-300 font-bold text-xl mb-4">Todos</h2>
        <div className="custom-scrollbar w-full flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1">
          {todo.length === 0 ? (
            <p className="text-zinc-500 font-medium text-sm text-center py-4">
              No todos yet...
            </p>
          ) : (
            todo.map((item, idx) => (
              <div
                key={idx}
                className="w-full px-4 py-3 bg-zinc-700/60 rounded-lg flex items-center justify-between hover:bg-zinc-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <input
                    checked={item.checked}
                    type="checkbox"
                    onChange={() => toggleCheck(idx)}
                    className="cursor-pointer w-4 h-4 accent-blue-500"
                  />
                  <span
                    className={`text-sm ${
                      item.checked
                        ? "line-through text-zinc-500"
                        : "text-zinc-300"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTodoUpdate(item.id)}
                    className="hover:scale-110 cursor-pointer transition-transform duration-150"
                  >
                    <SquarePen size={18} color="white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="hover:scale-110 cursor-pointer transition-transform duration-150"
                  >
                    <Trash2 size={18} color="red" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="fixed cursor-pointer right-8 bottom-8 text-white text-sm font-medium rounded-lg py-3 px-6 bg-red-600 hover:bg-red-500 transition-colors duration-200 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
}
