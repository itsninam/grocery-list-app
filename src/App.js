//Modules
import firebase from "./firebase";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  increment,
} from "firebase/database";
import { useEffect, useState } from "react";

//Components
import Form from "./components/Form";

//styling
import "./App.css";

function App() {
  //store database information
  const [groceryItems, setGroceryItems] = useState([]);

  //store user input
  const [userInput, setUserInput] = useState("");

  //store number of items
  let [count, setCount] = useState(1);

  //clear list button
  const [showClearList, setShowClearList] = useState(false);

  // retrieve data from firebase
  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      const dbData = response.val();

      const dataArray = [];
      for (let key in dbData) {
        dataArray.push({
          key: key,
          itemName: dbData[key].itemName,
          amount: dbData[key].amount,
        });
      }
      setGroceryItems(dataArray);
    });
  }, []);

  //obtain user input
  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  //push user input to database on submit and clear form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userInput) {
      alert("Please enter an item!");
    } else {
      const database = getDatabase(firebase);
      const dbRef = ref(database);

      push(dbRef, {
        itemName: userInput,
        amount: count,
      });

      setUserInput("");
    }
  };

  //clear list
  const handleClearList = () => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    remove(dbRef);
    setGroceryItems([]);
  };

  // remove individual item
  const handleRemoveItem = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}`);
    remove(dbRef);
  };

  // increase amount
  const handleIncreaseAmount = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}/amount`);

    setCount((count += 1));
    set(dbRef, count);
  };

  //decrease amount
  const handleDecreaseAmount = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}/amount`);

    setCount((count -= 1));
    set(dbRef, count);
  };

  return (
    <div className="wrapper">
      <h1>All out of...</h1>
      <Form
        handleSubmit={handleSubmit}
        userInput={userInput}
        handleUserInput={handleUserInput}
      />
      <div className="buttonContainer">
        <button onClick={handleClearList} className="btn">
          Clear list
        </button>
      </div>
      <ul className="listContainer">
        {groceryItems.map((item) => {
          console.log(item);
          return (
            <li key={item.key}>
              <p>{item.itemName}</p>
              <div className="buttonsCon">
                <button onClick={() => handleIncreaseAmount(item.key)}>
                  +
                </button>
                <p>{item.amount}</p>
                <button onClick={() => handleDecreaseAmount(item.key)}>
                  -
                </button>
                {/* <button onClick={() => handleRemoveItem(item.key)}>
                  Remove item
                </button> */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
