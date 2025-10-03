import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Titles from '../Components/Titles';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/booking/user')
      console.log("📌 API Response:", data) // ✅ Debugging

      if (data.success) {
        // ✅ Handle both `booking` and `bookings`
        const list = data.booking || data.bookings || []
        setBookings(list)
      } else {
        toast.error(data.message || "Failed to fetch bookings")
      }
    } catch (error) {
      console.error("❌ Fetch error:", error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchMyBookings()
  }, [user])

  return (
    <div>
      <motion.div
       initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
       className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'>
        <Titles title="My Bookings" subTitle="View and manage all your car bookings" align="left" />

        <div>
          {bookings.length === 0 ? (
            <p className="text-gray-500 mt-12">No bookings found.</p>
          ) : (
            bookings.map((booking, index) => (
              <motion.div
                 initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4,delay:0.1*index}}
                key={booking._id || index}
                className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
              >
                {/* Car Info */}
                <div className='md:col-span-1 '>
                  <div className='rounded-md overflow-hidden mb-3 '>
                    <img
                      src={booking.car?.image}
                      className='w-full h-auto aspect-video object-cover'
                      alt={booking.car?.brand || "car"}
                    />
                  </div>
                  <p className='text-lg font-medium mt-2'>
                    {booking.car?.brand} {booking.car?.model}
                  </p>
                  <p className='text-gray-500'>
                    {booking.car?.year} • {booking.car?.category} • {booking.car?.location}
                  </p>
                </div>

                {/* Booking Details */}
                <div className='md:col-span-2 '>
                  <div className='flex items-center gap-2 '>
                    <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                    <p
                      className={`px-3 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-400/15 text-green-600'
                          : 'bg-red-400/15 text-red-600'
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>
                  <div className='flex items-start gap-2 mt-3'>
                    <img src={assets.calendar_icon_colored} className='w-4 h-4 mt-1' alt="calendar" />
                    <div>
                      <p className='text-gray-500'>Rental Period</p>
                      <p>{booking.pickupDate?.split('T')[0]} To {booking.returnDate?.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2 mt-3'>
                    <img src={assets.location_icon_colored} className='w-4 h-4 mt-1' alt="location" />
                    <div>
                      <p className='text-gray-500'>Pickup Location</p>
                      <p>{booking.car?.location}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className='md:col-span-1 flex flex-col justify-between gap-6 '>
                  <div className='text-sm text-gray-500 text-right '>
                    <p>Total Price</p>
                    <h1 className='text-2xl font-semibold text-primary '>
                      {currency}{booking.price}
                    </h1>
                    <p>Booked on {booking.createdAt?.split('T')[0]}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MyBookings

