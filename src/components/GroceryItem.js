import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

const GroceryItem = ({
  image,
  itemName,
  itemAmount,
  handleRemoveItem,
  handleDecreaseAmount,
  handleIncreaseAmount,
}) => {
  return (
    <li>
      <div className="rightItems">
        <div className="imgContainer">
          <img src={image} alt={itemName} />
        </div>
        <p className="itemName">{itemName}</p>
      </div>
      <div className="btnContainer">
        <button className="removeItem" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faXmark} className="icon" />
          <span className="sr-only">Remove item</span>
        </button>
        <div className="updateBtns">
          <button onClick={handleDecreaseAmount}>
            <FontAwesomeIcon icon={faMinus} className="icon changeAmount" />
            <span className="sr-only">Decrease amount</span>
          </button>
          <p className="itemAmount">{itemAmount}</p>
          <button onClick={handleIncreaseAmount}>
            <FontAwesomeIcon icon={faPlus} className="icon changeAmount" />
            <span className="sr-only">Increase amount</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default GroceryItem;
