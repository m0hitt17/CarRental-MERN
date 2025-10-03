import React, { useEffect, useState } from 'react'
import Titles from './../Components/Titles';
import { assets } from '../assets/assets';
import CarCard from './../Components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from './../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const { axios, cars } = useAppContext()

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [allCars, setAllCars] = useState([])
  const [filterCars, setFilterCars] = useState([]) 
  const [input, setInput] = useState('');

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/booking/check-availability',
        { location: pickupLocation, pickupDate, returnDate })

      if (data.success) {
        setAllCars(data.availableCars)
        setFilterCars(data.availableCars)
        if (data.availableCars.length === 0) {
          toast('No cars available')
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch available cars")
    }
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability()
    } else {
      setAllCars(cars)
      setFilterCars(cars)
    }
  }, [pickupLocation, pickupDate, returnDate, cars])

  useEffect(() => {
    if (!input.trim()) {
      setFilterCars(allCars)
    } else {
      const lowerInput = input.toLowerCase()
      setFilterCars(
        allCars.filter(car =>
          car.brand.toLowerCase().includes(lowerInput) ||
          car.model.toLowerCase().includes(lowerInput) ||
          car.category.toLowerCase().includes(lowerInput) ||
          (car.fuel_type && car.fuel_type.toLowerCase().includes(lowerInput)) ||
          (car.transmission && car.transmission.toLowerCase().includes(lowerInput))
        )
      )
    }
  }, [input, allCars])

  return (
    <div>
      <motion.div
        initial={{opacity:0,y:30}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:0.6,ease:"easeOut"}}
        className='flex flex-col items-center py-20 bg-light max-md:px-4 '>
        <Titles 
          title="Available Cars" 
          subTitle="Browse our selection of premium vehicles available for your next adventure" 
        />
        <motion.div
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{duration:0.5,delay:0.6}}
          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow '>
          <img src={assets.search_icon} className='w-4.5 h-4.5 mr-2' alt="search" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full h-full outline-none text-gray-500 "
            placeholder='Search by make, model or features'
          />
          <img src={assets.filter_icon} className='w-4.5 h-4.5 ml-2' alt="filter" />
        </motion.div>
      </.div>
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 '>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto ' >
          Showing {filterCars.length} Cars
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto '>
          {filterCars.map((car, index) => (
            <motion.div
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.4, delay:0.1*index}}
              key={index}>
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cars
