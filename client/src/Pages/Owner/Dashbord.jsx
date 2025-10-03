import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from './../../Components/owner/Title';

import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppCOntext';

const Dashboard = () => {
  const { axios, isOwner, currency, dashboardRefresh } =  useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored }
  ];

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...'); 
      const { data: res } = await axios.get('/api/owner/dashboard');
      console.log('Dashboard data received:', res); 
      if (res.success) {
        setData({
          totalCars: res.dashboardData.totalCars ?? 0,
          totalBookings: res.dashboardData.totalBookings ?? 0,
          pendingBookings: res.dashboardData.pendingBookings ?? 0,
          completedBookings: res.dashboardData.completedBookings ?? 0,
          recentBookings: res.dashboardData.recentBookings ?? [],
          monthlyRevenue: res.dashboardData.monthlyRevenue ?? 0
        });
        console.log('Dashboard state updated with:', res.dashboardData);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log('Dashboard useEffect triggered. isOwner:', isOwner, 'dashboardRefresh:', dashboardRefresh);
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner, dashboardRefresh]); // This should trigger when dashboardRefresh changes

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title 
        title="Admin Dashboard" 
        subtitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />
      
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-3xl'>
        {dashboardCards.map((card, index) => (
          <div 
            key={index} 
            className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'
          >
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div>
              <img src={card.icon} className='h-4 w-4' alt={card.title} />
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-6 w-full'>
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>
          
          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div key={index} className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'> 
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                    <img src={assets.listIconColored} className='h-5 w-5' alt="booking" />
                  </div>
                  <div>
                    <p>{booking.car?.brand} {booking.car?.model}</p>
                    <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 font-medium'>
                  <p className='text-sm text-gray-500'>{currency} {booking.price}</p>
                  <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-400 mt-4'>No recent bookings</p>
          )}
        </div>

        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>
            {currency} {data.monthlyRevenue}
          </p>
        </div>    
      </div>
    </div>
  );
};

export default Dashboard;