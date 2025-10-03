import express from "express";
import { protect } from "../Middleware/auth.js";
import { 
    addCar, 
    changeRoleToOwner, 
    deleteCar, 
    getDashboardData, 
    getOwnerCars, 
    toggleCarAvailability, 
    updateUserImage 
} from "../controllers/ownerController.js";
import upload from "../Middleware/multer.js";

const ownerRouter = express.Router();

// Change user role to owner
ownerRouter.post('/change-role', protect, changeRoleToOwner);

// Add car - protect should come AFTER upload middleware
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);

// Get owner's cars - should be GET, not POST
ownerRouter.get("/car", protect, getOwnerCars);

// Toggle car availability
ownerRouter.post("/toggle-availability", protect, toggleCarAvailability);

// Delete car
ownerRouter.post("/delete-car", protect, deleteCar);

// Get dashboard data
ownerRouter.get("/dashboard", protect, getDashboardData);

// Update user image - protect should come AFTER upload middleware
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage);

export default ownerRouter;