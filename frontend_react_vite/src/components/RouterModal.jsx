import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function RouterModal(props) {

  const [newTitle, setNewTitle] = useState(props.title);
  const [newDescription, setNewDescription] = useState(props.description);
  
  const handleClose = () => props.setShow(false);
  const handleShow = () => props.setShow(true);

  return (
      <>
          <Modal show={props.show} onHide={handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>{props.modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form>
                  <Form.Group className="mb-3" controlId="formTitle">
                      <Form.Label>Title : </Form.Label>
                      <Form.Control name="title" defaultValue={props.title} onChange={(event) => setNewTitle(event.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description : </Form.Label>
                      <Form.Control name="description" defaultValue={props.description} onChange={(event) => setNewDescription(event.target.value)} />
                  </Form.Group>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={() => props.handleUpdate(newTitle,newDescription,props.myId,)}>
                    Save Changes
                    </Button>
                  </Form>
              </Modal.Body>
          </Modal>
      </>
  );
};

    
export default RouterModal;