import React from "react";
import { Routes,Route } from "react-router-dom";
import {Home,Dashboard} from './Pages';
import ProtectedRoute from './ProtectedRoute'
import 'react-tooltip/dist/react-tooltip.css';

function App(){

  return (
    <div>
            <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            </Routes>
    </div>
  );
}

export default App;