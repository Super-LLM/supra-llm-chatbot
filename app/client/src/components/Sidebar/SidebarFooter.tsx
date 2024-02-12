import { useEffect, useRef, useState } from 'react';
import { FaInfo, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SidebarFooter = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const usernameButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });
  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !usernameButtonRef.current?.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  return (
    <div className='relative'>
      {/* MENU WHEN CLICKING ON USERNAME */}
      <span
        ref={menuRef}
        className={`absolute bottom-full w-full bg-default rounded-md border-default ease-in-out ${
          menuOpen
            ? 'opacity-100 duration-300'
            : 'hidden opacity-0 duration-200'
        }`}
      >
        <Link
          to='/about'
          className='rounded-t-md p-3 bg-hover hover:bg-default flex items-center'
        >
          <FaInfo className='mr-3' />
          About
        </Link>
        <hr className='border-default' />
        <Link
          to='/'
          onClick={handleLogout}
          className='rounded-b-md p-3 bg-hover hover:bg-default flex items-center'
        >
          <FaSignOutAlt className='mr-3' />
          Logout
        </Link>
      </span>

      {/* USERNAME BUTTON */}
      <button
        ref={usernameButtonRef}
        onClick={() => setMenuOpen(!menuOpen)}
        className={`${
          menuOpen ? 'bg-hover' : 'bg-black'
        } mt-1 p-3 w-full rounded-[6px]  hover:bg-hover flex items-center justify-start`}
      >
        <FaUser className='rounded-md mr-3' />
        <div className='font-semibold'>Username</div>
      </button>
    </div>
  );
};

export default SidebarFooter;
