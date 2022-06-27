import './App.css'

import { Button } from '@mantine/core';
import { Login } from './pages/login';
import { useEffect, useState } from 'react';
import { Furnitures } from './pages/furnitures';

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
