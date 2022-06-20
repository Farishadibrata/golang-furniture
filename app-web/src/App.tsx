import './App.css'

import { Button } from '@mantine/core';
import Furnitures from './pages/furnitures';
import { Login } from './pages/login';
import { useEffect, useState } from 'react';

export function MyApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkLogin = () => {
    return setIsLoggedIn(!!localStorage.getItem('jwt'))
  }

  useEffect(() => {
    checkLogin()
  } , [])

  return isLoggedIn ? <Furnitures checkLogin={checkLogin}/>  : <Login setIsLoggedIn={setIsLoggedIn} checkLogin={checkLogin} /> ;
}

export default MyApp
