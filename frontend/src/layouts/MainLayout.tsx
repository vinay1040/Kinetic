import { Outlet } from "react-router";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import MobileBottomNav from "@/components/shared/MobileBottomNav";

const MainLayout = () => {
  return (
    <div>
        <NavBar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
        <MobileBottomNav/>
    </div>
  )
}

export default MainLayout;