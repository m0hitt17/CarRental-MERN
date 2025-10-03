import React, { useEffect, useState } from 'react'
import Title from '../../Components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { axios, currency, isOwner } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/booking/owner'); // Fixed: singular 'booking'
      if (data.success) {
        setBookings(data.bookings);
        console.log('Fetched bookings:', data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error.response || error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/booking/change-status', { // Fixed: singular 'booking'
        bookingId, 
        status 
      });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Change status error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchOwnerBookings();
    }
  }, [isOwner]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title 
        title="Manage Bookings" 
        subtitle="Track all customer bookings, approve or cancel requests and manage booking status" 
      />
      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className='p-6 text-center text-gray-500'>
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={booking._id || index} className='border-t border-borderColor text-gray-500'>
                  <td className='p-3'>
                    <div className='flex items-center gap-2'>
                      <img 
                        src={booking.car?.image} 
                        className='h-12 w-12 aspect-square rounded-md object-cover' 
                        alt={booking.car?.brand}
                      />
                      <p className='font-medium max-md:hidden'>
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                    </div>
                  </td>
                  <td className='p-3 max-md:hidden'>
                    <div className='text-xs'>
                      <p>{booking.pickupDate?.split('T')[0]}</p>
                      <p className='text-gray-400'>to</p>
                      <p>{booking.returnDate?.split('T')[0]}</p>
                    </div>
                  </td>
                  <td className='p-3'>{currency}{booking.price}</td>
                  <td className='p-3'>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-600' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select 
                        onChange={e => changeBookingStatus(booking._id, e.target.value)} 
                        value={booking.status} 
                        className='px-2 py-1.5 text-gray-600 border border-borderColor rounded-md outline-none cursor-pointer'
                      >
                        <option value='pending'>Pending</option>
                        <option value='confirmed'>Confirmed</option>
                        <option value='cancelled'>Cancelled</option>
                      </select>
                    ) : (
                      <span className='text-gray-400 text-xs'>No action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;