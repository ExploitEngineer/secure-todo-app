import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (email && password) {
      try {
        const response = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("Invalid credentials");
          form.email.value = "";
          form.password.value = "";
          throw new Error("Something went wrong");
        }
        toast.success("Successfully logged in.");
        navigate("/dashboard");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-800 flex items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-white font-bold text-2xl">Login</h1>
        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          className="text-white placeholder:text-sm border border-blue-500 rounded-lg px-4 py-2 outline-none"
        />
        <input
          name="password"
          required
          type="password"
          placeholder="Password"
          className="text-white placeholder:text-sm border border-blue-500 rounded-lg px-4 py-2 outline-none"
        />
        <button
          type="submit"
          className="w-full text-white font-medium py-2 px-8 rounded-lg cursor-pointer bg-zinc-700 hover:bg-blue-600 duration-300 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
}
