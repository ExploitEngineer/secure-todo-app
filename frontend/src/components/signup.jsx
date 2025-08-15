import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (username && email && password) {
      try {
        const response = await fetch("http://127.0.0.1:4000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("something went wrong");
          throw new Error("Error creating user");
        }

        const data = await response.json();
        console.log("Signup Response:", data);

        toast.success("Successfully Signed up!");

        navigate("/login");
      } catch (err) {
        console.error(err.message);
      }
    }
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-800">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        <input
          name="username"
          required
          type="text"
          placeholder="Username"
          className="rounded-lg border border-blue-500 px-4 py-2 text-white outline-none placeholder:text-sm"
        />
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
          onClick={() => {
            navigate("/login");
          }}
          className="cursor-pointer text-right text-sky-600"
        >
          have account login ?
        </button>
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-zinc-700 px-8 py-2 font-medium text-white transition-all duration-300 hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
