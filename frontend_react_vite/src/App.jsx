import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './components/Router';
import RouterModal from './components/RouterModal';
import Button from 'react-bootstrap/Button';

function App() {

  const [routers, setRouters] = useState([]);
  const [showNew, setShowNew] = useState(false);

  const handleNewClose = () => setShowNew(false);
  const handleNewShow = () => setShowNew(true);

  const fetchUserData = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(import.meta.env.VITE_API_URI + "/api/routers/", requestOptions)
    const json = await response.json();
    setRouters(json);
  }

  useEffect(() => {
    fetchUserData();
  },[])

  const handleNew = (title,description,myId) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description })
    };
      
    let resp = fetch(import.meta.env.VITE_API_URI + '/api/routers/', requestOptions)
      .then((resp) => fetchUserData());
    setShowNew(false);
  };

  return (
    <>
    <div className="container">
      <div className="jumbotron">
        <h1 className="display-4">Online Router Database</h1>
      </div>
      {routers.map((router) => <Router 
        id={router.id} 
        title={router.title} 
        description={router.description} 
        fetchUserData={fetchUserData}
        ></Router>)}
        <Button onClick={fetchUserData} hidden={true}>Load Routers</Button>
        {/* <Button onClick={fetchUserData}>Load Routers</Button> */}
        <Button onClick={handleNewShow}>New Router</Button>
        <RouterModal 
          show={showNew} 
          setShow={setShowNew} 
          handleUpdate={handleNew} 
          modalTitle="New Router" 
          title=""
          description=""
          />
    </div>
    </>
  );
}

export default App
