import Dashboard from "../components/dashboard";

export function DashboardPage({ todos, setTodos, selectedUser }) {
  return (
    <Dashboard todos={todos} setTodos={setTodos} selectedUser={selectedUser} />
  );
}
