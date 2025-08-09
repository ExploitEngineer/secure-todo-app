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
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-800">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold text-white">Login</h1>
        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          className="rounded-lg border border-blue-500 px-4 py-2 text-white outline-none placeholder:text-sm"
        />
        <input
          name="password"
          required
          type="password"
          placeholder="Password"
          className="rounded-lg border border-blue-500 px-4 py-2 text-white outline-none placeholder:text-sm"
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-zinc-700 px-8 py-2 font-medium text-white transition-all duration-300 hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
