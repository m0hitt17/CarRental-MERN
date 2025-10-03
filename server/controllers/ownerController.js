import imageKit from "../configs/imageKit.js";
import fs from 'fs';
import Car from './../models/car.js';
import Booking from "../models/Booking.js";
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

//Generate jwt token
export const generateToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET);
};

// FIXED: Now returns the updated user object
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        
        // Update user role and get the updated document
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            { role: "owner" }, 
            { new: true } // This returns the updated document
        ).select('-password'); // Exclude password from response
        
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Return the updated user object so frontend can update state
        res.json({ 
            success: true, 
            message: "You can now list your own cars!",
            user: updatedUser // Include updated user with role: "owner"
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let carData = JSON.parse(req.body.carData || '{}');
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.json({ success: false, message: 'No image uploaded for car' });
        }

        // Support both memoryStorage and diskStorage
        let fileBuffer;
        if (imageFile.buffer) {
            fileBuffer = imageFile.buffer;
        } else if (imageFile.path) {
            fileBuffer = fs.readFileSync(imageFile.path);
        } else {
            return res.json({ success: false, message: 'Uploaded file is invalid' });
        }

        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        let optimizedImageURL;
        if (response.filePath) {
            optimizedImageURL = imageKit.url({
                path: response.filePath,
                transformation: [
                    { width: '1280' },
                    { quality: "auto" },
                    { format: "webp" }
                ]
            });
        } else if (response.url) {
            optimizedImageURL = response.url;
        } else {
            optimizedImageURL = '';
        }

        await Car.create({ ...carData, owner: _id, image: optimizedImageURL });
        console.log('Car created successfully for owner:', _id);

        // remove temp file if any
        if (imageFile.path) {
            try { 
                fs.unlinkSync(imageFile.path);
            } catch (e) { 
                /* ignore */ 
            }
        }

        res.json({ success: true, message: "Car Added" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const targetCar = await Car.findById(carId);

        if (!targetCar) {
            return res.json({ success: false, message: 'Car not found' });
        }

        if (targetCar.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        targetCar.isAvailable = !targetCar.isAvailable;
        await targetCar.save();
        res.json({ success: true, message: "Availability toggled" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const targetCar = await Car.findById(carId);

        if (!targetCar) {
            return res.json({ success: false, message: 'Car not found' });
        }

        if (targetCar.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Mark as removed from listing (or you can remove document)
        targetCar.owner = null;
        targetCar.isAvailable = false;
        await targetCar.save();

        res.json({ success: true, message: "Car removed" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        
        if (role !== "owner") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Get owner's cars
        const cars = await Car.find({ owner: _id });
        console.log('Total cars found for owner:', cars.length);

        // Get all bookings and populate car details
        const allBookings = await Booking.find()
            .populate({ path: 'car', select: 'brand model owner' })
            .sort({ createdAt: -1 });

        // Filter bookings for this owner's cars
        const ownerBookings = allBookings.filter(
            b => b.car && b.car.owner && b.car.owner.toString() === _id.toString()
        );

        const pendingBookings = ownerBookings.filter(b => b.status === "pending");
        const completedBookings = ownerBookings.filter(b => b.status === "confirmed");

        const monthlyRevenue = ownerBookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((acc, booking) => acc + (booking.price || 0), 0);

        const dashboardData = {
            totalCars: cars.length || 0,
            totalBookings: ownerBookings.length || 0,
            pendingBookings: pendingBookings.length || 0,
            completedBookings: completedBookings.length || 0,
            recentBookings: ownerBookings.slice(0, 3) || [],
            monthlyRevenue: monthlyRevenue || 0
        };

        console.log('Dashboard data being sent:', dashboardData);
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log('Dashboard error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.json({ success: false, message: 'No image uploaded' });
        }

        // Support both memory and disk storage
        let fileBuffer;
        if (imageFile.buffer) {
            fileBuffer = imageFile.buffer;
        } else if (imageFile.path) {
            fileBuffer = fs.readFileSync(imageFile.path);
        } else {
            return res.json({ success: false, message: 'Uploaded file format not supported' });
        }

        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        let optimizedImageURL;
        if (response.filePath) {
            optimizedImageURL = imageKit.url({
                path: response.filePath,
                transformation: [
                    { width: '400' },
                    { quality: "auto" },
                    { format: "webp" }
                ]
            });
        } else if (response.url) {
            // fallback to returned url
            optimizedImageURL = response.url;
        } else {
            optimizedImageURL = '';
        }

        await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

        // clean up temp file if multer used disk storage
        if (imageFile.path) {
            try { 
                fs.unlinkSync(imageFile.path);
            } catch (e) { 
                /* ignore */ 
            }
        }

        res.json({ success: true, message: "Image updated", image: optimizedImageURL });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};