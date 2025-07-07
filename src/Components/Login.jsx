import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import { FaChartLine } from 'react-icons/fa';
import CONFIG from '../Configuration';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const IP = CONFIG.API_URL;

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
    console.log(data.user);
    navigate('/dashboard');
  } else {
    alert(data.error || 'Login failed');
  }
};

  return (
    <div className="w-[30vw] p-8 bg-white rounded-xl shadow-2xl border border-orange-100">
      <div className="flex justify-center mb-6">
        {/* <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <FiArrowRight className="text-white text-xs" />
          </div>
        </div> */}
        <img src='/logo.PNG' className='w-[6vw] h-[6vw]'/>
      </div>

      <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">CallSid CRM</h2>
      <p className="text-center text-orange-400 mb-8">Sales Performance Dashboard</p>

      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Login;
