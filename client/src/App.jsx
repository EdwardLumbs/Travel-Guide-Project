import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
import EditProfile from './pages/ProfilePage/EditProfile'
import UserPlans from './pages/ProfilePage/UserPlans'
import UserBlogs from './pages/ProfilePage/UserBlogs'
import UserReviews from './pages/ProfilePage/UserReviews'

import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

import LocalHostClear from './utils/LocalHostClear'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route element={<LocalHostClear/>}>
          <Route path='/' element={<Home/>} />
          <Route path='login' element={<Login/>} />
          <Route path='sign-up' element={<SignUp/>} />
          <Route path='blogs' element={<Blogs/>} />
          <Route path='about' element={<About/>} />
          <Route path='reviews' element={<Reviews/>} />
          <Route element={<PrivateRoute/>}>
            <Route path='profile' element={<Profile/>}>
              <Route index element={<UserPlans/>} />
              <Route path='user-blogs' element={<UserBlogs/>} />
              <Route path='user-reviews' element={<UserReviews/>} />
              <Route path='edit' element={<EditProfile/>} />
            </Route>
          </Route>
          {/* Add the Search Page and Flight Page Soon */}
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
