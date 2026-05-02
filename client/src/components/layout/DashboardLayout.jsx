import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PageWrapper from "../animations/PageWrapper";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <PageWrapper className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role={user?.role} />
        <div className="space-y-6">
          <Navbar user={user} />
          <Outlet />
        </div>
      </div>
    </PageWrapper>
  );
}

export default DashboardLayout;
