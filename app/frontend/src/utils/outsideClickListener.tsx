import { useEffect } from 'react';

export const useOutsideClickListener = (callback: (event: MouseEvent) => void) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [callback]);
};

