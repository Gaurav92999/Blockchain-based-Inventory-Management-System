import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import InventoryManagement from "./contracts/InventoryManagement.json"
import './styles.css'

function App() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  const [item, setItem] = useState(null);

  useEffect(() => {
    const connectWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = InventoryManagement.networks[networkId];
          const contract = new web3.eth.Contract(
            InventoryManagement.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contract);
          setMessage(`Connected to Web3 network with account: ${accounts[0]}`);
        } catch (error) {
          console.error(error);
        }
      } else {
        setMessage("Please install MetaMask to connect to the Ethereum network");
      }
    };
    connectWeb3();
  }, []);

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleIsAvailableChange = (event) => {
    setIsAvailable(event.target.checked);
  };

  const handleAddItem = async () => {
    try {
      await contract.methods.addItem(id, name, quantity).send({ from: accounts[0] });
      setMessage(`Added item with ID ${id}`);
    } catch (error) {
      console.error(error);
      setMessage(`Error adding item with ID ${id}`);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      await contract.methods.changeItemQuantity(id, quantity).send({ from: accounts[0] });
      setMessage(`Updated quantity of item with ID ${id}`);
    } catch (error) {
      console.error(error);
      setMessage(`Error updating quantity of item with ID ${id}`);
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      await contract.methods.changeItemAvailability(id, isAvailable).send({ from: accounts[0] });
      setMessage(`Updated availability of item with ID ${id}`);
    } catch (error) {
      console.error(error);
      setMessage(`Error updating availability of item with ID ${id}`);
    }
  };

  const handleViewItem = async () => {
    try {
      const item = await contract.methods.viewItem(id).call();
      setItem(item);
      setMessage(`Fetched details of item with ID ${id}`);
    } catch (error) {
      console.error(error);
      setMessage(`Error fetching details of item with ID ${id}`);
    }
  };

  return (

    <div className="container">
    <h1 className="title">Inventory Management</h1>
    <p className="message">{message}</p>
    <div className="add-item">
      <h2 className="sub-title">Add Item</h2>
      <label htmlFor="id" className="form-label">ID:</label>
      <input type="text" id="id" className="form-input" onChange={handleIdChange} />
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name:</label>
        <input type="text" id="name" className="form-input" onChange={handleNameChange} />
      </div>
      <div className="form-group">
        <label htmlFor="quantity" className="form-label">Quantity:</label>
        <input type="number" id="quantity" className="form-input" onChange={handleQuantityChange} />
      </div>
      <div className="form-group">
        <label htmlFor="isAvailable" className="form-label">Available:</label>
        <input type="checkbox" id="isAvailable" onChange={handleIsAvailableChange} />
      </div>
      <button className="button" onClick={handleAddItem}>Add Item</button>
    </div>
    <div className="update-quantity">
      <h2 className="sub-title">Update Quantity</h2>
      <div className="form-group">
        <label htmlFor="id-update-quantity" className="form-label">ID:</label>
        <input type="text" id="id-update-quantity" className="form-input" onChange={handleIdChange} />
      </div>
      <div className="form-group">
        <label htmlFor="quantity-update-quantity" className="form-label">New Quantity:</label>
        <input type="number" id="quantity-update-quantity" className="form-input" onChange={handleQuantityChange} />
      </div>
      <button className="button" onClick={handleUpdateQuantity}>Update Quantity</button>
    </div>
    <div className="update-availability">
      <h2 className="sub-title">Update Availability</h2>
      <div className="form-group">
        <label htmlFor="id-update-availability" className="form-label">
          <input type="text" id="id-update-availability" onChange={handleIdChange} />
        </label>
        <label htmlFor="isAvailable-update-availability" className="form-label">New Availability:</label>
        <input type="checkbox" id="isAvailable-update-availability" onChange={handleIsAvailableChange} />
      </div>
      <button onClick={handleUpdateAvailability} className="button">Update Availability</button>
    </div>
    <div className="view-item">
      <h2 className="sub-title">View Item</h2>
      <div className="form-group">
        <label htmlFor="id-view-item" className="form-label">
          <input type="text" id="id-view-item" onChange={handleIdChange} />
        </label>
        <button onClick={handleViewItem} className="button">View Item</button>
      </div>
      {item && (
        <div className="item-details">
          <h2 className="sub-title">Item Details</h2>
          <p>ID: {item.id}</p>
          <p>Name: {item.name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Available: {item.isAvailable.toString()}</p>
        </div>
      )}
    </div>
  </div>
  );  
}

export default App;