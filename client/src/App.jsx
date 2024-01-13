import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Reviews from './pages/Reviews'

import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/blogs' element={<Blogs/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/reviews' element={<Reviews/>} />
        {/* Add the Search Page and Flight Page Soon */}
      </Routes>
    </BrowserRouter>

  )
}

export default App
