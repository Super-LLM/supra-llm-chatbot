import { useRef } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import {
  TbArrowBadgeLeftFilled,
  TbArrowBadgeRightFilled,
  TbMinusVertical,
} from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import { useOutsideClickListener } from '../../utils/outsideClickListener';
import NewChatButton from '../NewChatButton';
import ChatsHistory from './ChatHistory';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { showSidebar, isDeleteDialogOpen } = useSelector(
    (state: RootState) => state.chat
  );
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    /* 
    Close the sidebar if it is opened 
    and the screen width is less than 768px
    when clicking outside of the sidebar
    */
    if (
      showSidebar &&
      window.innerWidth < 768 &&
      !sidebarRef.current?.contains(event.target as Node) &&
      !isDeleteDialogOpen
    ) {
      dispatch(toggleSidebar(false));
    }
  };

  useOutsideClickListener(handleOutsideClick);

  return (
    <div ref={sidebarRef} className='absolute h-screen md:relative'>
      <div className='flex items-start md:items-center'>
        {/* ANIMATION */}
        <div
          className={`relative bg-black transition-transform ease-in-out z-10 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* SIDEBAR CONTENTS */}
          <div
            className={`${
              showSidebar ? 'flex flex-col h-screen' : 'hidden'
            } px-2 py-1 `}
          >
            <NewChatButton text='New Chat' />
            <ChatsHistory />
            <SidebarFooter />
          </div>
        </div>

        {/* TOGGLE SIDEBAR BUTTON IN DESKTOP SCREEN */}
        <button
          className=''
          onClick={async () => {
            dispatch(toggleSidebar(!showSidebar));
          }}
        >
          {showSidebar ? (
            <div className='relative md:flex'>
              {/* MOBILE SCREEN*/}
              <AiOutlineCloseSquare size={30} className='block md:hidden' />

              {/* DESKTOP SCREEN*/}
              <div className='group hidden md:block' title='Close Sidebar'>
                <TbMinusVertical size={25} className='group-hover:hidden' />
                <TbArrowBadgeLeftFilled
                  size={25}
                  className='hidden group-hover:block'
                />
              </div>
            </div>
          ) : (
            <TbArrowBadgeRightFilled
              size={25}
              className='hover:opacity-100 opacity-60 hidden md:block absolute top-1/2 left-1'
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
