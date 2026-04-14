import './App.css'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import AccountPage from './pages/AccountPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import Orders from './pages/account/Orders'
import AddressPage from './pages/account/AddressesPage'
import AddressEditPage from './pages/account/AddressEditPage'
import SettingsPage from './pages/account/Settings'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import  AddressNewPage  from './pages/account/AddresNewPage'
import NotificationsPage from './pages/account/NotificationsPage'
import HelpPage from './pages/account/HelpPage'
function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/account" element={<AccountPage />}/>
            <Route path="/shoppingcart" element={<ShoppingCartPage/>}/>
            <Route path="/account/orders" element={<Orders />}/>
            <Route path="/account/addresses" element={<AddressPage />}/>
            <Route path="/account/settings" element={<SettingsPage />}/>
            <Route path="/account/notifications" element={<NotificationsPage />}/>
            <Route path="/account/help" element={<HelpPage/>}/>
            <Route path="/account/addresses/edit" element={<AddressEditPage />}/>
            <Route path="/account/addresses/new" element={<AddressNewPage />}/>
            <Route path="/product" element={<ProductPage />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
