import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Register from "./Components/Admin/Register";
import Login from "./Components/Admin/Login";
import AdminHome from "./Components/Admin/AdminHome";
import AddProduct from "./Components/Admin/AddProduct";
import UserRegister from "./Components/User/UserRegister";
import Home from "./Home";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Footer from "./Pages/Footer";

const ViewProduct = lazy(() => import("./Pages/ViewProduct"));
const Nav = lazy(() => import("./Pages/Nav"));
const UserLogin = lazy(() => import("./Components/User/Userlogin"));
const Address = lazy(() => import("./Pages/Address"));

const Layout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isCartOpen = queryParams.get("cart") == "open";

  const hideNavRoute = [
    "/admin/register",
    "/admin/login",
    "/admin/home",
    "/admin/home/users",
    "/admin/home/products",
    "/admin/home/orders",
    "/admin-protected/register",
    "/admin-first-secured/login",
  ];

  const shouldHideNav =
    hideNavRoute.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  const isMobile = window.innerWidth <= 430;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNav && <Nav />}

      {/* Main content with bottom padding for footer space */}
      <main>
        <Suspense fallback="loading...">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:title/:id" element={<ViewProduct />} />
            <Route path="/admin-protected/register" element={<Register />} />
            <Route path="/admin-first-secured/login" element={<Login />} />
            <Route path="/admin/home/*" element={<AdminHome />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/shipping" element={<Address />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer only in mobile, fixed bottom */}

      {isMobile && !isCartOpen && <Footer />}
    </div>
  );
};

export default Layout;
