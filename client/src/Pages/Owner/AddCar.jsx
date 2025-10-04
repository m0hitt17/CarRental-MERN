import React, { useState } from 'react'
import Title from '../../Components/owner/Title'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast';
<<<<<<< HEAD
import { useAppContext } from '../../context/AppContext';  // ✅ fixed import
=======
import { useAppContext } from '../../context/AppContext'
>>>>>>> 9e8220f44d087822fe753087b52a7876ef3eb07f

const AddCar = () => {
  const { axios, triggerDashboardRefresh } = useAppContext();
  
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));
      
      const { data } = await axios.post('/api/owner/add-car', formData);
      
      if(data.success){
        toast.success(data.message);
        if (typeof triggerDashboardRefresh === 'function') {
          triggerDashboardRefresh();
        }
        setImage(null);
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='px-4 py-10 md:px-10 flex-1 bg-light min-h-screen'>
      <Title title="Add New Car" subtitle="Fill in details to add a new car for booking" />
      
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8 text-gray-500 text-sm mt-6 max-w-xl mx-auto bg-white p-8 rounded-lg shadow'>
        
        <div className='flex flex-col md:flex-row items-center gap-4 w-full'>
          <label htmlFor='car-image' className='cursor-pointer'>
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_icon} 
              className='h-14 w-14 rounded object-cover border border-borderColor' 
              alt="car upload" 
            />
            <input 
              type='file' 
              id='car-image' 
              accept='image/*' 
              hidden 
              onChange={e => setImage(e.target.files[0])} 
            />
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>

        {/* --- Inputs remain same as before --- */}
        {/* Brand, Model, Year, Price, Category, Transmission, Fuel, Seating, Location, Description */}

        <button 
          type='submit'
          className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'
        >
          <img src={assets.tick_icon} alt="tick" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
