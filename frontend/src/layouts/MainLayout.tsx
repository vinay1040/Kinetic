import { Outlet } from "react-router";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";

const MainLayout = () => {
  return (
    <div>
        <NavBar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default MainLayout;