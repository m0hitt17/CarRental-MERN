import express from 'express';
import { 
    changeBookingStatus, 
    checkAvailabilityOfCar, 
    createBooking, 
    getOwnerBooking, 
    getUserBooking 
} from '../controllers/bookingController.js';
import { protect } from './../Middleware/auth.js';

const bookingRouter = express.Router();

// Check availability - POST (needs body data)
bookingRouter.post('/check-availability', checkAvailabilityOfCar);

// Create booking - POST (protected)
bookingRouter.post('/create', protect, createBooking);

// Get user bookings - GET (protected)
bookingRouter.get('/user', protect, getUserBooking);

// Get owner bookings - GET (protected)
bookingRouter.get('/owner', protect, getOwnerBooking);

// Change booking status - POST (protected)
bookingRouter.post('/change-status', protect, changeBookingStatus);


export default bookingRouter;