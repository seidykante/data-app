import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import Header from "./Header";

const MainLayout = () => {

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header className="flex items-end justify-end" /> */}
        <main className="flex-1 overflow-x-hidden bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
