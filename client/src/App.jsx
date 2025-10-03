
import Navbar from "./Components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import CarDetails from "./Pages/CarDetails";
import Cars from "./Pages/Cars";
import MyBookings from "./Pages/MyBookings";
import Footer from "./Components/Footer";
import Layout from "./Pages/Owner/Layout";
import Dashbord from "./Pages/Owner/Dashbord";
import AddCar from "./Pages/Owner/AddCar";
import ManageCar from "./Pages/Owner/ManageCar";
import ManageBookings from "./Pages/Owner/ManageBookings";
import Login from "./Components/Login";
import {Toaster} from 'react-hot-toast'
import { useAppContext } from "./context/AppContext";

const App = () => {
  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster/>
    {showLogin&&   <Login/> }
  
      {!isOwnerPath &&<Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/car-details/:id" element={<CarDetails/>}/>
        <Route path="/cars" element={<Cars/>}/>
        <Route path="/my-bookings" element={<MyBookings/>}/>

         <Route path ='/owner'element={<Layout/>}>
         <Route index element ={<Dashbord/>}/>
         <Route path='add-car'element ={<AddCar/>}/>
         <Route path ='manage-cars' element ={<ManageCar/>}/>
         <Route path ='manage-bookings' element ={<ManageBookings/>}/>


      </Route>

      </Routes>

     
    {!isOwnerPath && <Footer/>}
    </>
  );
};

export default App;
