import Dashboard from "../components/dashboard";

export function DashboardPage({ todos, setTodos }) {
  return <Dashboard todos={todos} setTodos={setTodos} />;
}
