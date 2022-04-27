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
import axios from "axios";

//Components
import Form from "./components/Form";

//styling
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

function App() {
  //store database information
  const [groceryItems, setGroceryItems] = useState([]);

  //store user input from the form
  const [userInput, setUserInput] = useState("");

  //store item count
  let [count, setCount] = useState(1);

  //warning message
  const [warningMessage, setWarningMessage] = useState(false);

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
          apiImage: dbData[key].apiImage,
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
      //api call
      axios({
        url: "https://api.unsplash.com/search/photos",
        method: "GET",
        dataResponse: "json",
        params: {
          client_id: "SPWoYE3TRrK7rkvIR2uFqa0RuCJ-tfaeJvWqFzdyd-w",
          query: userInput,
          per_page: 1,
        },
      })
        .then((response) => {
          const apiImage = response.data.results[0].urls.small;

          const database = getDatabase(firebase);
          const dbRef = ref(database);

          push(dbRef, {
            itemName: userInput,
            amount: count,
            apiImage: apiImage,
          });

          setUserInput("");
          setWarningMessage(false);
        })
        .catch((err) => {
          setWarningMessage(true);
          setUserInput("");
        });
    }
  };

  //clear entire list
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
      {warningMessage ? (
        <p className="warningMessage">Something went wrong, try again!</p>
      ) : (
        ""
      )}
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
          return (
            <li key={item.key}>
              <div className="rightItems">
                <div className="imgContainer">
                  <img src={item.apiImage} alt={item.itemName} />
                </div>
                <p>{item.itemName}</p>
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
                  <button onClick={() => handleIncreaseAmount(item.key)}>
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="sr-only">Increase amount</span>
                  </button>
                  <p>{item.amount}</p>
                  <button onClick={() => handleDecreaseAmount(item.key)}>
                    <FontAwesomeIcon icon={faMinus} className="icon" />
                    <span className="sr-only">Decrease amount</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
