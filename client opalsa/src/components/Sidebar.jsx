import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { RiHome4Line } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { VscClose } from "react-icons/vsc";
import { TfiHarddrives } from "react-icons/tfi";
function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const { logout, user } = useAuth();

  return (
    <div className={`bg-sidebar-900 h-[95vh] fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all z-50 duration-500 shadow-lg ${showMenu ? "left-0" : "-left-full"}`}>
      {/* PERFIL */}
      <div className='p-4 pt-8 '>
        {user && (
          <div className=' p-4 rounded-lg drop-shadow-xl flex flex-col items-center gap-3'>
            <h3 className="text-xl font-semibold text-white">{user.username}</h3>
            <p className="text-white overflow-hidden truncate">{user.email}</p>
            <p className='bg-sidebar-100 py-1 px-2 rounded-full text-white'>Administrador</p>
          </div>
        )}
      </div>

      {/* MENU */}
      <div className='pt-4'>
      <div className='bg-slate-200 font-semibold text-zinc-900 p-5 pt-[10px] rounded-tr-[100px] h-[110vh] flex flex-col justify-between gap-6'>
        <nav className='flex flex-col gap-12   pt-14'>
          <Link to="/admin" className='flex items-center gap-4  py-2 px-4 rounded-xl hover:bg-sidebar-900/50 transition-colors'>
            <RiHome4Line /> Home
          </Link>
          <Link to="/Usuarios" className='flex items-center gap-4  py-2 px-4 rounded-xl hover:bg-sidebar-900/50 transition-colors'>
            <LuUsers /> Gestion Usuarios
          </Link>
          <Link to="/notifi" className='flex items-center gap-4  py-2 px-4 rounded-xl hover:bg-sidebar-900/50 transition-colors'>
            <IoNotificationsOutline /> Notificaciones y Ordenes
          </Link>
          <Link to="/GestionMaquinas" className='flex items-center gap-4  py-2 px-4 rounded-xl hover:bg-sidebar-900/50 transition-colors'>
            <TfiHarddrives /> Aplicacion
          </Link>
          <Link to="/login" onClick={logout} className='flex items-center gap-4  py-2 px-4 rounded-xl hover:bg-sidebar-900/50 transition-colors'>
            <FiLogOut /> Logout
          </Link>
        </nav>
      </div>

      {/* Button Mobile */}
      <button onClick={() => setShowMenu(!showMenu)} className='lg:hidden fixed right-4 bottom-4 text-2xl bg-sidebar-900 p-2.5 rounded-full text-white z-50'>
        {showMenu ? <VscClose /> : <AiOutlineMenu />}
      </button>
    </div>
    </div>
  );
}

export default Sidebar;