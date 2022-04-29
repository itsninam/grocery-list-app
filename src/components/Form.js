const Form = ({ handleSubmit, userInput, handleUserInput }) => {
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <h2>Create a grocery list for your next shopping trip!</h2>
        <label htmlFor="itemName" className="sr-only">
          Add grocery item
        </label>
        <input
          id="itemName"
          type="text"
          placeholder="Add item (e.g. apples 🍎)"
          value={userInput}
          onChange={handleUserInput}
        />
        <button type="submit" className="btn">
          Add item
        </button>
      </form>
    </>
  );
};

export default Form;
