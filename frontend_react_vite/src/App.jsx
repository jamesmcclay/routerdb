import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './components/Router';

function App() {

  const [routers, setRouters] = useState([])
  const fetchUserData = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch("api/routers/", requestOptions)
    .then(response => {return response.json()})
    .then(json => {setRouters( json )})
  }

  useEffect(() => {
    fetchUserData();
  },[])

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
      </div>
      </>
    );
}

export default App
