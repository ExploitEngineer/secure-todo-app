import { useNavigate } from "react-router-dom";

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

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error("Error creating user");
        }
        navigate("/login");
      } catch (err) {
        console.error(err.message);
      }
    }
  };
  return (
    <div className="w-full min-h-screen bg-zinc-800 flex items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <h1 className="text-white font-bold text-2xl">Sign Up</h1>
        <input
          name="username"
          required
          type="text"
          placeholder="Username"
          className="text-white placeholder:text-sm border border-blue-500 rounded-lg px-4 py-2 outline-none"
        />
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
          onClick={() => {
            navigate("/login");
          }}
          className="text-right text-sky-600 cursor-pointer"
        >
          have account login ?
        </button>
        <button
          type="submit"
          className="w-full text-white font-medium py-2 px-8 rounded-lg cursor-pointer bg-zinc-700 hover:bg-blue-600 duration-300 transition-all"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
