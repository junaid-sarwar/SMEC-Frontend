import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// ✅ CORRECT IMPORT (Points to the file we just edited)
import { Toaster } from "@/components/ui/sonner";

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/routes/AdminRoute'; 
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      {/* 
         Put Toaster here. 
         position="top-center" makes it drop down from the top 
         richColors allows red/green backgrounds if you use toast.success() 
      */}
      <Toaster position="top-center" richColors />
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/events/:id" element={<EventDetails />} />
           <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" 
          element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App