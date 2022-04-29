//Modules
import firebase from "./firebase";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  get,
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

  //warning message
  const [warningMessage, setWarningMessage] = useState(false);

  //total item count
  const [totalItem, setTotalItems] = useState(0);

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
          amount: 1,
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
    getTotal();
  };

  //clear entire list
  const handleClearList = () => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    remove(dbRef);
    setGroceryItems([]);
    setTotalItems(0);
  };

  // remove individual item
  const handleRemoveItem = (key) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${key}`);
    remove(dbRef);
    setTotalItems(totalItem - 1);
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

    setTotalItems(totalItem + 1);
  };

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
        setTotalItems(totalItem - 1);
      }
    });
  };

  const getTotal = () => {
    let sum = groceryItems.reduce(function (prev, current) {
      return prev + current.amount;
    }, 1);
    setTotalItems(sum);
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
        <p>Total items: {totalItem} </p>
        <div className="buttonContainer">
          <button onClick={handleClearList} className="btn clearList">
            Clear list
          </button>
        </div>
        <ul className="listContainer">
          {groceryItems.map((item) => {
            console.log(item);
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
