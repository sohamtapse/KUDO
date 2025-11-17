import AddRepo from "@/components/AddRepo";
import { getServerSession } from "next-auth";
import DashboardList from "@/components/DashboardList"; // optional

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-2xl text-white font-bold">Dashboard</h1>

      {/* USER ADDS REPO HERE */}
      <AddRepo />

      {/* SHOW REVIEWS HERE */}
      <DashboardList />
    </div>
  );
}
