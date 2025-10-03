import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from './../../Components/owner/Title';
import { useAppContext } from './../../context/AppContext';
import toast from 'react-hot-toast';

const ManageCar = () => {
  const { axios, isOwner, currency } = useAppContext();
  
  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/car'); // Use singular 'car' to match backend
      if (data.success) {
        setCars(data.cars);
        console.log('Fetched cars:', data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch cars error:', error.response || error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-availability', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }
    
    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title 
        title="Manage cars" 
        subtitle="View all listed cars, update their details or remove them from the booking platform" 
      />
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="5" className='p-6 text-center text-gray-500'>
                  No cars listed yet
                </td>
              </tr>
            ) : (
              cars.map((car, index) => (
                <tr key={index} className='border-t border-borderColor'>
                  <td className='p-3 flex items-center gap-3'>
                    <img 
                      src={car.image} 
                      className='h-12 w-12 aspect-square rounded-md object-cover' 
                      alt={car.brand} 
                    />
                    <div className='max-md:hidden'>
                      <p className='font-medium'>{car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500'>
                        {car.seating_capacity} seats • {car.transmission}
                      </p>
                    </div>
                  </td>
                  <td className='p-3 max-md:hidden'>{car.category}</td>
                  <td className='p-3'>{currency} {car.pricePerDay}/day</td>
                  <td className='p-3'>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs ${
                        car.isAvailable 
                          ? 'bg-green-100 text-green-500' 
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className='p-3'>
                    <div className='flex items-center gap-2'>
                      <img 
                        src={car.isAvailable ? assets.eye_icon : assets.eye_close_icon} 
                        alt="toggle visibility" 
                        className='cursor-pointer'
                        onClick={() => toggleAvailability(car._id)}
                        title={car.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                      />
                      <img 
                        src={assets.delete_icon} 
                        className='cursor-pointer' 
                        alt="delete"
                        onClick={() => handleDelete(car._id)}
                        title='Delete car'
                      />
                    </div>
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

export default ManageCar;