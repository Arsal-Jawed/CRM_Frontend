import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import CONFIG from '../Configuration';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState('');
  
  const navigate = useNavigate();
  const IP = CONFIG.API_URL;

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

const updateCountdown = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentTime = now.getTime();

  const today = new Date();
  const sevenAM = new Date(today.setHours(7, 0, 0, 0));
  const nineAM = new Date(today.setHours(9, 0, 0, 0));
  const noon = new Date(today.setHours(11, 59, 59, 999));

  const nextSevenAM = new Date();
  if (currentHour < 7) {
    nextSevenAM.setHours(7, 0, 0, 0);
  } else {
    nextSevenAM.setDate(nextSevenAM.getDate() + 1);
    nextSevenAM.setHours(7, 0, 0, 0);
  }

  if (currentHour >= 7 && currentHour < 9) {
    const diff = nineAM - now;
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown(`Attendance window will open in ${hrs} hrs ${mins} minutes ${secs} seconds`);
  } 
  else if (currentHour >= 9 && currentTime <= noon.getTime()) {
    setCountdown('Attendance window is open');
  } 
  else if (currentHour >= 0 && currentHour < 7) {
    setCountdown('Attendance window closed, contact the HR manager');
  } 
  else if (currentHour >= 12 && currentHour < 24) {
    setCountdown('Attendance window is closed, contact HR Manager');
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${IP}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));

      try {
        await fetch(`${IP}/attendance/mark`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email })
        });
      } catch (err) {
        console.error('Attendance marking failed:', err);
      }

      navigate('/dashboard');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="w-[30vw] p-8 bg-white rounded-xl shadow-2xl border border-orange-100">
      <div className="flex justify-center mb-6">
        <img src='/logo.PNG' className='w-[6vw] h-[6vw]' alt="Logo" />
      </div>

      <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">CallSid CRM</h2>
      <p className="text-center text-orange-400 mb-8">Sales Performance Dashboard</p>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <FiUser className="text-orange-500 mr-2" />
            <label className="text-orange-700 font-medium" htmlFor="email">Email Address</label>
          </div>
          <div className="relative">
            <input
              className="w-full p-3 pl-10 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition"
              type="email"
              id="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FiUser className="absolute left-3 top-3.5 text-orange-300" />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <FiLock className="text-orange-500 mr-2" />
            <label className="text-orange-700 font-medium" htmlFor="password">Password</label>
          </div>
          <div className="relative">
            <input
              className="w-full p-3 pl-10 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FiLock className="absolute left-3 top-3.5 text-orange-300" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2 accent-orange-500"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm text-orange-600">Show Password</label>
          </div>

          <a href="#" className="text-sm text-orange-500 hover:text-orange-700 flex items-center">
            <FiHelpCircle className="mr-1" /> Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition duration-300 shadow-md flex items-center justify-center"
        >
          Sign In <FiArrowRight className="ml-2" />
        </button>

        {/* Timer Display */}
        {countdown && (
          <p
            className={`text-center text-[0.9vw] mt-1 ${
              countdown.includes('will open') ? 'text-clr2' :
              countdown.includes('closed') ? 'text-red-500' :
              'text-green-500'
            }`}
          >
            {countdown}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;