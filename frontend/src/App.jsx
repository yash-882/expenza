import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
function App() {
   return (
    <>
    <Navbar/>
    {/* routes element appears here*/}
    <Outlet/>
    </>
  );
}

export default App
