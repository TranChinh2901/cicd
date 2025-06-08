
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import PublicRoute from "./Router/PublicRoute";
import UserRoute from "./Router/UserRoute";
import AdminRoute from "./Router/AdminRoute";
import Profile from "./pages/Profile/Profile";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
     
        
        {/* Authentication Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Protected User Routes */}
        <Route 
          path="/profile" 
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          } 
        />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              {/* <Dashboard /> */}
            </AdminRoute>
          } 
        />
        
        {/* Error & Utility Routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;