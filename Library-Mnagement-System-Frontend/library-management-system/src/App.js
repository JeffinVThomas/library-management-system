import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/UserLogin';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Borrow from './pages/Borrow';
import MyBooks from './pages/MyBooks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AddBook from './pages/AddBook';
import ManageBooks from './pages/ManageBooks';
import UserRegister from './pages/UserRegister';
import ChangePassword from './pages/ForgotPassword';
function App() {
  const isLoggedIn = localStorage.getItem('token'); // basic check

  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Dashboard /> }  />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/borrow" element={isLoggedIn ? <Borrow /> : <Navigate to="/login" />} />
        <Route path="/my-books" element={isLoggedIn ? <MyBooks /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/add-book" element={<AddBook />} /> {/* ✅ New route */}
        <Route path="manage-books" element={<ManageBooks />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/forgot-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
