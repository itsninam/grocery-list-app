const Form = ({ handleSubmit, userInput, handleUserInput }) => {
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        {/* <label htmlFor="itemName">Add item</label> */}
        <input
          id="itemName"
          type="text"
          placeholder="Add item (e.g. apples)"
          value={userInput}
          onChange={handleUserInput}
        />
      </form>
    </>
  );
};

export default Form;
