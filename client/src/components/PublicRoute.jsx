import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

export default function PublicRoute() {
    const {currentUser} = useSelector((state) => state.user);
    const location = useLocation()
    console.log(location)

  return (
    currentUser ? (location.pathname === '/login' ? <Navigate to='/'/> : <Navigate to='/profile'/> ): <Outlet/> 
  )
}