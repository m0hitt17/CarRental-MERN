import React, { useState } from 'react'
import Title from '../../Components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from './../../context/AppContext';
import toast from 'react-hot-toast';

const AddCar = () => {
  const { axios, currency, triggerDashboardRefresh } = useAppContext();
  
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
    if(isLoading){
      return null;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));
      const { data } = await axios.post('/api/owner/add-car', formData);
      
      if(data.success){
        toast.success(data.message);
        triggerDashboardRefresh();
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
      }
      else{
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
      <Title title="Add New Car" subtitle="Fill in details to a new car for booking" />
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8 text-gray-500 text-sm mt-6 max-w-xl mx-auto bg-white p-8 rounded-lg shadow'>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full'>
          <label htmlFor='car-image' className='cursor-pointer'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} className='h-14 w-14 rounded object-cover border border-borderColor' alt="car upload" />
            <input type='file' id='car-image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type='text' placeholder='e.g. BMW, Mercedes, Audi,...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.brand} onChange={e => setCar({
              ...car, brand: e.target.value
            })} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type='text' placeholder='e.g. X5, A6, E-class,...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.model} onChange={e => setCar({
              ...car, model: e.target.value
            })} />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type='number' placeholder='2025' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.year} onChange={e => setCar({
              ...car, year: e.target.value
            })} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price</label>
            <input type='number' placeholder='100' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.pricePerDay} onChange={e => setCar({
              ...car, pricePerDay: e.target.value
            })} />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <label>Category</label>
          <select onChange={e => setCar({ ...car, category: e.target.value })} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light'>
            <option value=''>Select a category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
            <option value="Van">SportsCar</option>
          </select>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e => setCar({ ...car, transmission: e.target.value })} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light'>
              <option value=''>Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light'>
              <option value=''>Select a Fuel Type</option>
              <option value="Gas">Gas</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type='number' placeholder='4' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.seating_capacity} onChange={e => setCar({
              ...car, seating_capacity: e.target.value
            })} />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <label>Location</label>
          <select onChange={e => setCar({ ...car, location: e.target.value })} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light'>
            <option value=''>Select a Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
            <option value="Chicago">Ohio</option>
            <option value="Chicago">Florida</option>
            <option value="Chicago">Washington</option>
            <option value="Chicago">Atlanta</option>
            
          </select>
        </div>

        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea placeholder='A luxurious SUV with a spacious interior....' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-light' value={car.description} onChange={e => setCar({
            ...car, description: e.target.value
          })} />
        </div>
        
        <button type='submit' className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="tick" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;