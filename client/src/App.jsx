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
import ViewBrands from "./pages/Admin/AdminPages/BrandLanguages/ViewBrand/ViewBrands";
import CreateBrand from "./pages/Admin/AdminPages/BrandLanguages/CreateBrand/CreateBrand";
import UpdateBrand from "./pages/Admin/AdminPages/BrandLanguages/UpdateBrand/UpdateBrand";
import DeleteBrand from "./pages/Admin/AdminPages/BrandLanguages/DeleteBrand/DeleteBrand";
import DeleteCategory from "./pages/Admin/AdminPages/CategoryLanguages/DeleteCategory/DeleteCategory";
import ViewCategory from "./pages/Admin/AdminPages/CategoryLanguages/ViewCategory/ViewCategory";
import ViewLanguages from "./pages/Admin/AdminPages/Languages/ViewLanguages/ViewLanguages";
import DeleteLanguages from "./pages/Admin/AdminPages/Languages/DeleteLanguages/DeleteLanguages";
import ViewBlogs from "./pages/Admin/AdminPages/BlogLanguages/ViewBlogs/ViewBlogs";
import DeleteBlog from "./pages/Admin/AdminPages/BlogLanguages/DeleteBlog/DeleteBlog";
import ViewUser from "./pages/Admin/AdminPages/Users/ViewUser/ViewUser";
import DeleteUser from "./pages/Admin/AdminPages/Users/DeleteUser/DeleteUser";
import CreateBlog from "./pages/Admin/AdminPages/BlogLanguages/CreateBlog/CreateBlog";
import UpdateBlog from "./pages/Admin/AdminPages/BlogLanguages/UpdateBlog/UpdateBlog";
import CreateCategory from "./pages/Admin/AdminPages/CategoryLanguages/CreateCategory/CreateCategory";
import UpdateCategory from "./pages/Admin/AdminPages/CategoryLanguages/UpdateCategory/UpdateCategory";
import CreateLanguages from "./pages/Admin/AdminPages/Languages/CreateLanguages/CreateLanguages";
import UpdateLanguages from "./pages/Admin/AdminPages/Languages/UpdateLanguages/UpdateLanguages";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryLanguages />} />
        <Route path="/blog/:id" element={<MainBlogLanguages />} />
        <Route path="/languages/by-category/:slug" element={<Languages />} />
        <Route path="/language_detail/:slug" element={<DetailLanguages />} />
        <Route path="/view-members" element={<ViewTeam />} />
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
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brands/view" element={<ViewBrands />} />
          <Route path="brands/create" element={<CreateBrand />} />
          <Route path="brands/edit/:slug" element={<UpdateBrand />} />
          <Route path="brands/delete" element={<DeleteBrand />} />
          <Route path="categories/view" element={<ViewCategory />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/edit/:slug" element={<UpdateCategory />} />
          <Route path="categories/delete" element={<DeleteCategory />} />
          <Route path="languages/view" element={<ViewLanguages />} />
          <Route path="languages/edit/:slug" element={<UpdateLanguages />} />
          <Route path="languages/create" element={<CreateLanguages />} />
          <Route path="languages/delete" element={<DeleteLanguages />} />
          <Route path="blogs/view" element={<ViewBlogs />} />
          <Route path="blogs/create" element={<CreateBlog />} />
          <Route path="blogs/delete" element={<DeleteBlog />} />
          <Route path="blogs/edit/:id" element={<UpdateBlog />} />
          <Route path="users/view" element={<ViewUser />} />
          <Route path="users/delete" element={<DeleteUser />} />
          <Route path="blogs/edit" element={<UpdateBlog />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;