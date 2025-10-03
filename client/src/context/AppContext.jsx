/* eslint-disable react-refresh/only-export-components */
import React, { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCar] = useState([]);
    const [dashboardRefresh, setDashboardRefresh] = useState(0);

    //function to check user is logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    //Function to fetch all cars from the server
    const fetchCar = async () => {
        try {
            const { data } = await axios.get('/api/user/cars');
            data.success ? setCar(data.cars) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    //Function to trigger dashboard refresh
    const triggerDashboardRefresh = () => {
        setDashboardRefresh(prev => prev + 1);
    };

    //function to logout the user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success('You have been logged out');
    };

    //useEffect to retrieve token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        fetchCar();
    }, []);

    //useEffect to fetch user data when token is available
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`;
            fetchUser();
        }
    }, [token]);

    const value = {
        navigate, 
        currency, 
        axios, 
        user, 
        setUser, 
        token, 
        setToken, 
        isOwner, 
        setIsOwner, 
        fetchUser, 
        showLogin, 
        setShowLogin, 
        logout, 
        fetchCar, 
        cars, 
        setCar, 
        pickupDate, 
        setPickupDate, 
        returnDate, 
        setReturnDate,
        dashboardRefresh,
        triggerDashboardRefresh
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);