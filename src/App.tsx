import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, useState } from "react";
import "./App.css";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RouteLoader } from "./components/pages/RouteLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import TrustBar from "./components/TrustBar";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WhatsAppFab from "./components/WhatsAppFab";
import Toast from "./components/Toast";

const Home = lazy(() => import("./components/pages/Home"));
const Shop = lazy(() => import("./components/pages/Shop"));
const CategoryPage = lazy(() => import("./components/pages/CategoryPage"));
const JournalPage = lazy(() => import("./components/pages/JournalPage"));
const WishlistPage = lazy(() => import("./components/pages/WishlistPage"));
const Login = lazy(() => import("./components/pages/Login"));
const Signup = lazy(() => import("./components/pages/Signup"));
const Account = lazy(() => import("./components/pages/Account"));
const Checkout = lazy(() => import("./components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("./components/pages/OrderConfirmation"));
const NotFound = lazy(() => import("./components/pages/NotFound"));

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState<string | null>(null);
  const { cart, cartCount, subtotal, changeQty, removeItem, cartOpen, closeCart, toast } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate(user ? "/checkout" : "/login", user ? undefined : { state: { from: "/checkout" } });
  };

  return (
    <div className="alora">
      <TrustBar />
      <Header onMobileOpen={() => setMobileOpen(true)} />
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        openCat={openMobileCat}
        setOpenCat={setOpenMobileCat}
      />

      <div className="main-area">
        <RouteLoader>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:orderId"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteLoader>
      </div>

      <Footer />
      <WhatsAppFab />
      <Toast message={toast} />

      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        cart={cart}
        cartCount={cartCount}
        subtotal={subtotal}
        changeQty={changeQty}
        removeItem={removeItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
