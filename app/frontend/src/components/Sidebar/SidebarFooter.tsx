import { useMsal } from '@azure/msal-react';
import { useEffect, useRef, useState } from 'react';
import { FaInfo, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { emptyChatHistory } from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import { setCurrentUser, signOutUser } from '../../redux/user/userSlice';
import { User } from '../../types';
import { useOutsideClickListener } from '../../utils/outsideClickListener';

const SidebarFooter = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const usernameButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { instance } = useMsal();

  useEffect(() => {
    const activeAccount = instance.getActiveAccount();

    if (activeAccount) {
      const id = activeAccount.localAccountId;
      const username = activeAccount.name!;
      const currentUser: User = { id, username };
      dispatch(setCurrentUser(currentUser));
    }
  }, [instance]);

  const handleLogout = async () => {
    dispatch(signOutUser());
    dispatch(emptyChatHistory());
    await instance.logoutRedirect();
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

  useOutsideClickListener(handleOutsideClick);

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
        <button
          onClick={handleLogout}
          className='rounded-b-md p-3 bg-hover hover:bg-default flex items-center w-full'
        >
          <FaSignOutAlt className='mr-3' />
          Log out
        </button>
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
        <div className='font-semibold'>{currentUser?.username}</div>
      </button>
    </div>
  );
};

export default SidebarFooter;
