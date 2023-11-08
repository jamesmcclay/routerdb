import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import RouterModal from './RouterModal';

function Router(props) {

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleUpdate = (title,description,myId) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description })
    };
    let resp = fetch(import.meta.env.VITE_API_URI + `/api/routers/${myId}/`, requestOptions)
      .then((resp) => props.fetchUserData())
      .then(() => setShow(false));
  };

  const handleDelete = (myId) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
      let resp = fetch(import.meta.env.VITE_API_URI + `/api/routers/${myId}/`, requestOptions)
        .then((resp) => props.fetchUserData());
    };

    return(
      <>
        <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
            <Button variant="primary" onClick={handleShow}>
              Edit
            </Button>
            <Button variant="danger" onClick={(event) => handleDelete(props.id)}>Delete</Button>
          </Card.Body>
        </Card>
        <RouterModal 
          show={show} 
          setShow={setShow} 
          handleUpdate={handleUpdate} 
          myId={props.id} 
          modalTitle="Edit Router"
          title={props.title}
          description={props.description}
          />
      </>    

    );
};

export default Router;