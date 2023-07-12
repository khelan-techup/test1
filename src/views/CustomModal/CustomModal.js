import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default function MyModal(props) {
  return (
    <Modal isOpen={props.isOpen}>
      <ModalHeader>{props.modalTitle}</ModalHeader>
      <ModalBody>{props.modalBody}</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={props.handleModal}>
          OK
  </Button>
      </ModalFooter>
    </Modal>
  );
}

//<Button color="primary" onClick={props.modalAction}>
//  Ok
//  </Button>
//{ " " }
