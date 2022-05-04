const ModalWindow = ({ modalWindow, handleModal }) => {
  return (
    <>
      {modalWindow ? (
        <div className="modalWindow">
          <p> Please enter an item! </p>
          <button className="btn modalBtn" onClick={handleModal}>
            Close
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ModalWindow;
