import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import PublicRoute from "./Router/PublicRoute";
import UserRoute from "./Router/UserRoute";
import AdminRoute from "./Router/AdminRoute";
import Profile from "./pages/Profile/Profile";
import CategoryLanguages from "./pages/ProgramLanguages/CategoryLanguages/CategoryLanguages";
import MainBlogLanguages from "./pages/ProgramLanguages/CategoryLanguages/BlogLanguages/MainBlogLanguages";
import Languages from "./pages/ProgramLanguages/CategoryLanguages/Languages/Languages";
import DetailLanguages from "./pages/ProgramLanguages/CategoryLanguages/Languages/DetailLanguages/DetailLanguages";
import ViewTeam from "./pages/JoinOurCommunity/ViewTeam/ViewTeam";
import AdminLayout from "./pages/Admin/AdminLayout/AdminLayout";
import Dashboard from "./pages/Admin/DashBoard/DashBoard";
import NotFound from "./pages/Admin/NotFound/NotFound";
import BrandLanguages from "./pages/Admin/BrandLanguages/BrandLanguages";
import CategoryLanguagesAdmin from "./pages/Admin/CategoryLanguages/CategoryLanguages";
import LanguagesAdmin from "./pages/Admin/Languages/Languages";
import BlogLanguagesAdmin from "./pages/Admin/BlogLanguages/BlogLanguages";
import Users from "./pages/Admin/Users/Users";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryLanguages />} />
        <Route path="/blog/:id" element={<MainBlogLanguages />} />
        <Route path="/languages/by-category/:slug" element={<Languages />} />
        <Route path="/language_detail/:slug" element={<DetailLanguages />} />
        <Route path="/view-members" element={<ViewTeam/>}/>
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

        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout/>
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="brand-languages" element={<BrandLanguages />} />
          <Route path="category-languages" element={<CategoryLanguagesAdmin />} />
          <Route path="languages" element={<LanguagesAdmin />} />
          <Route path="blog-languages" element={<BlogLanguagesAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;