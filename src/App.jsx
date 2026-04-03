import './App.css'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/shoppingcart"/>
            <Route path="/account"/>
            <Route path="/product" element={<ProductPage />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
