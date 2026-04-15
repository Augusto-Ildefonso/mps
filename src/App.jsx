import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import './App.css'
import AccountPage from './pages/AccountPage'
import LoginPage from "./pages/Login"
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import SearchPage from './pages/SearchPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import AddressNewPage from './pages/account/AddresNewPage'
import AddressEditPage from './pages/account/AddressEditPage'
import AddressPage from './pages/account/AddressesPage'
import HelpPage from './pages/account/HelpPage'
import NotificationsPage from './pages/account/NotificationsPage'
import Orders from './pages/account/Orders'
import SettingsPage from './pages/account/Settings'
import CheckoutAddressPage from './pages/checkout/CheckoutAddressPage'
import CheckoutPaymentPage from './pages/checkout/CheckoutPaymentPage'
import CheckoutReviewPage from './pages/checkout/CheckoutReviewPage'
import PaymentsPage from "./pages/account/PaymentsPage"
function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/account" element={<AccountPage />}/>
            <Route path="/shoppingcart" element={<ShoppingCartPage/>}/>
            <Route path="/account/orders" element={<Orders />}/>
            <Route path="/account/addresses" element={<AddressPage />}/>
            <Route path="/account/settings" element={<SettingsPage />}/>
            <Route path="/account/notifications" element={<NotificationsPage />}/>
            <Route path="/account/payments" element={<PaymentsPage />}/>
            <Route path="/account/help" element={<HelpPage/>}/>
            <Route path="/account/addresses/edit" element={<AddressEditPage />}/>
            <Route path="/account/addresses/new" element={<AddressNewPage />}/>
            <Route path="/product" element={<ProductPage />}/>
            <Route path="/checkout/address" element={<CheckoutAddressPage />}/>
            <Route path="/checkout/payment" element={<CheckoutPaymentPage />}/>
            <Route path="/checkout/review" element={<CheckoutReviewPage />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
