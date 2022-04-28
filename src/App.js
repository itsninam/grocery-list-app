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
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import axios from "axios";

//Components
import Form from "./components/Form";
import GroceryItem from "./components/GroceryItem";

//styling
import "./App.css";

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

  //api call
  const fetchData = () => {
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
        console.log(err);
        setWarningMessage(true);
        setUserInput("");
      });
  };

  //push user input to database on submit and clear form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userInput) {
      alert("Please enter an item!");
    } else {
      fetchData();
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

    //prevent negative values
    if (count < 1) {
      setCount(0);
    } else {
      setCount((count -= 1));
      set(dbRef, count);
    }
  };

  return (
    <>
      <div className="wrapper">
        <h1>All out of...</h1>
        <Form
          handleSubmit={handleSubmit}
          userInput={userInput}
          handleUserInput={handleUserInput}
        />
        <div className="warningMessage">
          {warningMessage ? <p>Something went wrong, try again!</p> : ""}
        </div>
        <div className="buttonContainer">
          <button onClick={handleClearList} className="btn">
            Clear list
          </button>
        </div>
        <ul className="listContainer">
          {groceryItems.map((item) => {
            return (
              <GroceryItem
                key={item.key}
                image={item.apiImage}
                itemName={item.itemName}
                handleRemoveItem={() => handleRemoveItem(item.key)}
                handleDecreaseAmount={() => handleDecreaseAmount(item.key)}
                handleIncreaseAmount={() => handleIncreaseAmount(item.key)}
                handleClearList={handleClearList}
                itemAmount={item.amount}
              />
            );
          })}
        </ul>
      </div>
      <footer>
        <p>
          Created at{" "}
          <a href="https://junocollege.com/"> Juno College for Technology</a>
        </p>
      </footer>
    </>
  );
}

export default App;
