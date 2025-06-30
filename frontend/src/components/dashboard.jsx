import { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [todo, setTodo] = useState([]);
  const [value, setValue] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:4000/todos", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching todos: ${response.statusText}`);
      }

      const data = await response.json();
      setTodo(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSetTodo = async () => {
    try {
      const res = await fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: value }),
      });

      if (!res.ok) {
        throw new Error(`Error adding todo: ${res.statusText}`);
      }

      const newTodo = await res.json();
      setTodo([newTodo, ...todo]);
      setValue("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleCheck = (index) => {
    const updatedTodos = todo.map(function (item, idx) {
      return index === idx ? { ...item, checked: !item.checked } : item;
    });
    setTodo(updatedTodos);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error logging out: ${response.statusText}`);
      }
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

      if (!res.ok) {
        throw new Error(`Error deleting todo: ${res.statusText}`);
      }

      setTodo(todo.filter((item) => item.id !== idx));
    } catch (err) {
      console.errror("Error deleting todo:", err.message);
    }
  };

  const handleTodoUpdate = async (idx) => {
    const newTitle = prompt("Enter new title");

    if (!newTitle) return;

    try {
      const res = await fetch(`http://localhost:4000/todos/${idx}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update todo: ${res.statusText}`);
      }

      const updateTodo = await res.json();

      setTodo((prevTodos) =>
        prevTodos.map((item) => (item.id === idx ? updateTodo : item))
      );
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-800 p-10 flex flex-col items-center overflow-x-hidden">
      <h1 className="text-white md:text-left text-center font-bold text-3xl">
        Welcome to Dashboard 👋
      </h1>
      <div className="flex items-center justify-center w-full dashboard mt-30">
        <div className="mt-3 max-w-[400px] flex flex-col items-center">
          <div className="w-full flex flex-wrap items-center justify-center gap-4">
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="block py-2 px-4 rounded-lg outline-none text-white border border-blue-600 placeholder:text-sm"
              placeholder="Enter task..."
            />
            <button
              onClick={handleSetTodo}
              className="text-white text-sm font-medium rounded-lg py-3 px-4 bg-blue-600 cursor-pointer"
            >
              Add Todo
            </button>
          </div>

          <div className="w-full todos flex flex-wrap flex-col items-center mt-10 bg-zinc-700 rounded-lg py-5 px-7">
            <h1 className="self-start ps-1 mb-3 text-zinc-300 font-bold text-xl">
              Todos
            </h1>
            <div className="custom-scrollbar w-full flex flex-col items-center gap-2 overflow-y-auto max-h-[300px]">
              {todo.length === 0 ? (
                <h4 className="text-zinc-400 font-medium text-sm mt-4">
                  No todos yet...
                </h4>
              ) : (
                todo.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full px-3 bg-zinc-600 rounded-lg py-4 flex items-center justify-between"
                  >
                    <div className="flex flex-grow-2 items-center gap-3">
                      <input
                        checked={item.checked}
                        type="checkbox"
                        onChange={() => toggleCheck(idx)}
                        className="cursor-pointer outline-none"
                      />
                      <h2
                        className={`text-zinc-400 text-sm ${
                          item.checked ? "line-through" : ""
                        }`}
                      >
                        {item.title}
                      </h2>
                    </div>
                    <div className="flex flex-grow-1 items-center justify-end gap-3">
                      <button
                        onClick={() => handleTodoUpdate(item.id)}
                        className="cursor-pointer"
                      >
                        <SquarePen size={18} color="white" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 size={18} color="red" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleLogout}
              className="fixed right-10 bottom-10 text-white text-sm font-medium rounded-lg py-3 px-6 bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
