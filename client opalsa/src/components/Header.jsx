import React from 'react'
import { FiSearch } from "react-icons/fi";

function Header() {
  return (
    <header className=' flex flex-col md:flex-row  items-center justify-between gap-4'>
      <h1 className='text-2xl md:text-3xl font-bold'>
        BIENVENIDO <span className='text-sidebar-100 drop-shadow-xl'>ADMINISTRADOR</span>
      </h1>
    </header>
  )
}

export default Header