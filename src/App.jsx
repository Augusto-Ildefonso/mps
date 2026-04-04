import './App.css'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import AccountPage from './pages/AccountPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import Orders from './pages/account/Orders'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
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
            <Route path="/product" element={<ProductPage />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
