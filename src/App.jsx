import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/search"/>
            <Route path="/shoppingcart"/>
            <Route path="/account"/>
          </Routes>
      </Router>
    </>
  )
}

export default App
