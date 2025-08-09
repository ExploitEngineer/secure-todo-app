import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function Dashboard() {
  const [todo, setTodo] = useState([]);
  const [value, setValue] = useState("");

  const navigate = useNavigate();

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
      index === idx ? { ...item, checked: !item.checked } : item,
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
        prevTodos.map((item) => (item.id === idx ? updateTodo : item)),
      );
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col items-center bg-white p-10 text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <div className="absolute -top-8 right-0">
        <ThemeToggleButton
          variant="gif"
          url="https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        />
      </div>
      <h1 className="mt-16 text-center text-3xl font-bold">
        Welcome to Dashboard 👋
      </h1>

      {/* Input + Add Button */}
      <div className="mt-8 flex w-full max-w-md gap-3">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-sm placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
          placeholder="Enter task..."
        />
        <Button
          onClick={handleSetTodo}
          className="cursor-pointer rounded-lg bg-blue-600 px-5 py-6 text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-400"
        >
          Add Todo
        </Button>
      </div>

      {/* Todos List */}
      <div className="mt-10 w-full max-w-md rounded-lg bg-zinc-100 p-6 shadow-lg dark:bg-zinc-800/80">
        <h2 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-300">
          Todos
        </h2>
        <div className="custom-scrollbar flex max-h-[300px] w-full flex-col gap-3 overflow-y-auto pr-1">
          {todo.length === 0 ? (
            <p className="py-4 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No todos yet...
            </p>
          ) : (
            todo.map((item, idx) => (
              <div
                key={idx}
                className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors duration-200 hover:bg-zinc-50 dark:bg-zinc-700/60 dark:hover:bg-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <input
                    checked={item.checked}
                    type="checkbox"
                    onChange={() => toggleCheck(idx)}
                    className="h-4 w-4 cursor-pointer accent-blue-500"
                  />
                  <span
                    className={`text-sm ${
                      item.checked
                        ? "text-zinc-400 line-through"
                        : "text-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleTodoUpdate(item.id)}
                    className="cursor-pointer bg-zinc-200 transition-transform duration-150 hover:scale-110 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <SquarePen
                      size={18}
                      className="text-zinc-800 dark:text-white"
                    />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="cursor-pointer bg-zinc-200 transition-transform duration-150 hover:scale-110 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        className="fixed right-8 bottom-8 cursor-pointer rounded-lg bg-red-600 px-6 py-5 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-red-500"
      >
        Logout
      </Button>
    </div>
  );
}
