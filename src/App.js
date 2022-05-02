//Modules
import firebase from "./firebase";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import { useEffect, useState } from "react";
import axios from "axios";

//Components
import Form from "./components/Form";
import GroceryItem from "./components/GroceryItem";

//styling
import "./App.css";
import Footer from "./components/Footer";

function App() {
  //store database information
  const [groceryItems, setGroceryItems] = useState([]);

  //store user input from the form
  const [userInput, setUserInput] = useState("");

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
  };

  //clear entire list
  const handleClearList = () => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    remove(dbRef);
    setGroceryItems([]);
  };

  return (
    <>
      <div className="wrapper">
        <h1>All out of...</h1>
        <Form
          handleSubmit={handleSubmit}
          userInput={userInput}
          handleUserInput={handleUserInput}
          warningMessage={warningMessage}
        />
        <p>
          Total items: {""}
          {groceryItems
            .map((item) => item.amount)
            .reduce((previous, current) => previous + current, 0)}
        </p>

        <div className="buttonContainer">
          <button onClick={handleClearList} className="btn clearList">
            Clear list
          </button>
        </div>
        <GroceryItem groceryItems={groceryItems} />
      </div>
      <Footer />
    </>
  );
}

export default App;
