import React from 'react'
import Hero from '../Components/Hero'
import FeaturedSection from '../Components/FeaturedSection'
import Banner from '../Components/Banner'
import Testimonials from './../Components/Testimonials';
import NewsLetter from '../Components/NewsLetter';

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedSection/>
        <Banner/>
        <Testimonials/>
        <NewsLetter/>
    </>
  )
}

export default Home