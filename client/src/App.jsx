import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Profile from './pages/Profile'
import Destinations from './pages/Destinations'
import Explore from './pages/Explore'
import Flights from './pages/Flights'
import EditProfile from './pages/ProfilePage/EditProfile'
import ProfileSummary from './pages/ProfilePage/ProfileSummary'
import UserBlogs from './pages/ProfilePage/UserBlogs'
import Country from './pages/Country'
import Continent from './pages/Continent'
import CreateBlogPost from './pages//BlogsPage/CreateBlogPost'
import BlogPage from './pages/BlogsPage/BlogPage'
import UserTrips from './pages/ProfilePage/UserTrips'
import Trip from './pages/Trip'

import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Footer from './components/Footer'

import LocalHostClear from './utils/LocalHostClear'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route element={<LocalHostClear/>}>
          <Route path='/' element={<Home/>} />
          <Route element={<PublicRoute/>}>
            <Route path='login' element={<Login/>} />
            <Route path='sign-up' element={<SignUp/>} />
          </Route>
          <Route path='/destinations' element={<Destinations/>} />
          <Route path='/destinations/:continent' element={<Continent/>} />
          <Route path='/destinations/:continent/:countryName' element={<Country/>} />
          <Route path='explore' element={<Explore/>} />
          <Route path='flights' element={<Flights/>} />
          <Route path='blogs' element={<Blogs/>} />
          <Route path='blogs/:blogId' element={<BlogPage/>} />
          <Route path='about' element={<About/>} />
          <Route element={<PrivateRoute/>}>
            <Route path='blogs/create' element={<CreateBlogPost/>} />
            <Route path='profile/user-trips/:tripId' element={<Trip/>}/>
            <Route path='profile' element={<Profile/>}>
              <Route index element={<ProfileSummary/>} />
              <Route path='user-trips' element={<UserTrips/>} />
              <Route path='user-blogs' element={<UserBlogs/>} />
              <Route path='edit' element={<EditProfile/>} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>

  )
}

export default App
