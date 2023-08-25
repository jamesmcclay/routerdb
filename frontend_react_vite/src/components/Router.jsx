import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Router(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (item) => {
    item.preventDefault();
    if (item.id) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, description: item.description })
      };
      fetch(`/api/routers/${item.id}/`, requestOptions)
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title, description: item.description })
    };
    fetch('/api/routers/', requestOptions)
  };

  const handleDelete = (item) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
      fetch(`/api/routers/${item.id}/`)
        .then((res) => props.fetchUserData());
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
          <Button variant="danger" onSubmit={handleDelete}>Delete</Button>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title : </Form.Label>
        <Form.Control name="title" placeholder={props.title} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description : </Form.Label>
        <Form.Control name="description" placeholder={props.description} />
      </Form.Group>
      <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit" variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Form>
      </Modal.Body>
    </Modal>
    </>    

    );
}

export default Router