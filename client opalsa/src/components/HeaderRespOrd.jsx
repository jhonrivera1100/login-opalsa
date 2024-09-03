import React from 'react';

function HeaderRespuestas() {
    return (
        <header className=' flex flex-col md:flex-row  items-center justify-between gap-4'>
          <h1 className='text-2xl md:text-3xl font-bold'>
            ORDENES SOLICITADAS AL   <span className='text-sidebar-100 drop-shadow-xl'>ADMINISTRADOR</span>
          </h1>
        </header>
      )
}

export default HeaderRespuestas
