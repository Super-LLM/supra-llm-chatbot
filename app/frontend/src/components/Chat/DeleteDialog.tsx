import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteChat,
  setIdToDelete,
  setIsDeleteDialogOpen,
} from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import { deleteRequest } from '../../utils/apiService';
import { useOutsideClickListener } from '../../utils/outsideClickListener';

const DeleteDialog = () => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { chatHistory, idToDelete, isDeleteDialogOpen } = useSelector(
    (state: RootState) => state.chat
  );

  const title = chatHistory.find((chat) => chat.id === idToDelete)?.title;

  const handleOutsideClick = (event: MouseEvent) => {
    if (dialogRef.current && dialogRef.current.contains(event.target as Node)) {
      dispatch(setIdToDelete(null));
      dispatch(setIsDeleteDialogOpen(false));
    }
  };

  useOutsideClickListener(handleOutsideClick);

  const handleCancel = () => {
    dispatch(setIdToDelete(null));
    dispatch(setIsDeleteDialogOpen(false));
  };

  const handleConfirmDelete = async () => {
    if (idToDelete) {
      try {
        const id = idToDelete;
        const response = await deleteRequest(id);
        if (response.ok) {
          dispatch(deleteChat(id));
          dispatch(setIdToDelete(null));
          dispatch(setIsDeleteDialogOpen(false));
        }
      } catch (e) {
        if (e instanceof Error) console.log(e.message);
      }
    }
  };

  return (
    isDeleteDialogOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        {/* DARK BG */}
        <div
          ref={dialogRef}
          className='bg-black opacity-80 fixed inset-0'
        ></div>

        {/* DIALOG */}
        <div className='bg-default rounded-lg z-10 md:w-1/3'>
          <h2 className='text-xl font-bold m-5'>Delete chat?</h2>
          <hr />
          <p className='m-5'>
            This will delete <strong>{title}</strong>.
          </p>
          <div className='flex justify-end gap-3 m-5 font-semibold'>
            <button
              className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400'
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className='bg-red-600 text-white px-4 py-2 mr-2 rounded-md hover:bg-red-700'
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteDialog;
