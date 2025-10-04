import React from 'react'
import Titles from './Titles'
import { assets } from "../assets/assets"
import { motion } from 'motion/react';


const Testimonials = () => {
  const testimonials = [
    {
      name: "Alexa",
      location: "New York",
      image: assets.testimonial_image_1,
      testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional."
    },
    {
      name: "Becky",
      location: "Los Angeles",
      image: assets.testimonial_image_2,
      testimonial: "The service was excellent, and the car was in pristine condition. Highly recommend!"
    },
    {
      name: "Nikki",
      location: "Florida",
      image: assets.testimonial_image_1,
      testimonial: "The experience was seamless from start to finish. Will definitely rent again!"
    }
  ];
  return (
    <div className='py-26 px-6 md:px-16 lg:px-24 xl:px-44 '>
      <Titles title="What Our Customer Say" subTitle="Discover why discerning travellers choose StayVenture for their luxury accommodations around the world" />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {testimonials.map((testimonial, index) => (
          <motion.div
          initial={{opacity:0,y:40}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:0.6,delay:index*0.2,ease:'easeOut'}}
        viewport={{once:true,amount:0.3}}
           key={index} className='bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300'>
            <div className='flex items-center gap-3'>
              <img src={testimonial.image} alt={testimonial.name} />
              <div>
                <p className='font-playfair text-xl'>{testimonial.name}</p>
                <p className='text-gray-500'>{testimonial.location}</p>
              </div>
            </div>
            <div className='flex items-center gap-1 mt-4'>
              {Array(5).fill(0).map((_, starIndex) => (
                <img key={starIndex} src={assets.star_icon} alt="Star" />
              ))}
            </div>
            <div>
              <p className='text-gray-500 max-w-90 mt-4 font-light'>
                {testimonial.testimonial}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials;