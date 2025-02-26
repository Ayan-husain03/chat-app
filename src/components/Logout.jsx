import React from 'react'
import { useAuth } from '../utils/AuthContext'

const Logout = ({
    className = ""
}) => {
   const {handleUserLogout} =  useAuth()
  return (

    <button className={`${className}`} onClick={handleUserLogout}>Logout</button>
  )
}

export default Logout