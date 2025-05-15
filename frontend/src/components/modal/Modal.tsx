import React, { FC } from "react";

const Modal: FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  dismiss?: boolean;
}> = ({ showModal, setShowModal, title, children, dismiss = false }) => {
  return (
    <>
      {showModal && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => dismiss && setShowModal(false)}
        >
          <div
            className='bg-dashboard-primary rounded-lg shadow-lg w-[750px] max-h-[90vh] flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center p-4 border-b border-dashboard-accent border-opacity-20'>
              <h2 className='text-xl font-semibold text-dashboard-primaryText'>
                {title}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-dashboard-primaryText hover:text-dashboard-secondary transition-colors'
              >
                ✕
              </button>
            </div>
            <div className='p-6 overflow-y-auto flex-1'>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
