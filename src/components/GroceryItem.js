//Modules
import firebase from "../firebase";
import { getDatabase, ref, set, remove, get } from "firebase/database";

//styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

const GroceryItem = ({ groceryItems, handleClearList }) => {
  //decrease amount
  const handleDecreaseAmount = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}/amount`);

    get(dbRef).then((snapshot) => {
      let currentCount = snapshot.val();
      //prevent negative values
      if (currentCount > 1) {
        currentCount = currentCount - 1;
        set(dbRef, currentCount);
      }
    });
  };

  // increase amount
  const handleIncreaseAmount = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}/amount`);

    get(dbRef).then((snapshot) => {
      let currentCount = snapshot.val();
      currentCount = currentCount + 1;
      set(dbRef, currentCount);
    });
  };

  // remove individual item
  const handleRemoveItem = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}`);
    remove(dbRef);
  };

  return (
    <div>
      <div className="flexContainer">
        <p>
          Total items: {""}
          {groceryItems
            .map((item) => item.amount)
            .reduce((previous, current) => previous + current, 0)}
        </p>
        <button onClick={handleClearList} className="btn clearList">
          Clear list
        </button>
      </div>
      <ul className="listContainer">
        {groceryItems.map((item) => {
          return (
            <li key={item.key}>
              <div className="rightItems">
                <div className="imgContainer">
                  <img src={item.apiImage} alt={item.itemName} />
                </div>
                <p className="itemName">{item.itemName}</p>
              </div>
              <div className="btnContainer">
                <button
                  className="removeItem"
                  onClick={() => handleRemoveItem(item.key)}
                >
                  <FontAwesomeIcon icon={faXmark} className="icon" />
                  <span className="sr-only">Remove item</span>
                </button>
                <div className="updateBtns">
                  <button onClick={() => handleDecreaseAmount(item.key)}>
                    <FontAwesomeIcon
                      icon={faMinus}
                      className="icon changeAmount"
                    />
                    <span className="sr-only">Decrease amount</span>
                  </button>
                  <p className="itemAmount">{item.amount}</p>
                  <button onClick={() => handleIncreaseAmount(item.key)}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="icon changeAmount"
                    />
                    <span className="sr-only">Increase amount</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroceryItem;
