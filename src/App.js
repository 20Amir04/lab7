import React, { useEffect, useState } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  return list ? JSON.parse(list) : [];
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please enter values");
    } else if (name && isEditing) {
      const updatedList = list.map((item) =>
        item.id === editID ? { ...item, title: name } : item
      );
      setList(updatedList);
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Item edited");
    } else {
      showAlert(true, "success", "Task added to the list");
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
      };
      setList([...list, newItem]);
      setName("");
    }

    setTimeout(() => {
      showAlert(false, "", "");
    }, 3000);
  };

  const clearList = () => {
    showAlert(true, "danger", "Empty list");
    setList([]);
  };

  const removeItem = (id) => {
    setList(list.filter((task) => task.id !== id));
    showAlert(true, "danger", "Item removed");
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      {alert.show && <Alert {...alert} />}
      <form className="grocery-form" onSubmit={handleSubmit}>
        <h3>TODO list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. pass the exam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
