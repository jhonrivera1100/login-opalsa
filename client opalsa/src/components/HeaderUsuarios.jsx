import React from 'react';

function HeaderUsuarios() {
    return (
        <header className=' flex flex-col md:flex-row  items-center justify-between gap-4'>
          <h1 className='text-2xl md:text-3xl font-bold'>
            GESTION DE <span className='text-sidebar-100 drop-shadow-xl'>USUARIOS</span>
          </h1>
        </header>
      )
}

export default HeaderUsuarios
