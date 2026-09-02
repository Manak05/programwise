import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ProgramDetails from './pages/ProgramDetails';
import Compare from './pages/Compare';
import Preferences from './pages/Preferences';
import Recommendations from './pages/Recommendations';
import SavedPrograms from './pages/SavedPrograms';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminProgramForm from './pages/admin/AdminProgramForm';
import AdminLookups from './pages/admin/AdminLookups';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/compare" element={<Compare />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPrograms /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/programs" element={<AdminRoute><AdminPrograms /></AdminRoute>} />
          <Route path="/admin/programs/new" element={<AdminRoute><AdminProgramForm /></AdminRoute>} />
          <Route path="/admin/programs/:id/edit" element={<AdminRoute><AdminProgramForm /></AdminRoute>} />
          <Route path="/admin/lookups" element={<AdminRoute><AdminLookups /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
