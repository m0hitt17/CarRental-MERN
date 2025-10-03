import React, { useEffect } from 'react'

import NabarOwner from '../../Components/owner/NabarOwner'
import Sidebar from '../../Components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const  {isOwner , navigate} =useAppContext()
  useEffect(()=>{
    if(!isOwner){
 navigate('/')
  }
},[isOwner])
  return (
    <div className=' flex  flex-col '>
        <NabarOwner/>
        <div className='flex'>
            <Sidebar/>
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout