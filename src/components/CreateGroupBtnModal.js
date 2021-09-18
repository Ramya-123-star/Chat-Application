import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import firebase from 'firebase/app';
import { useModalState } from '../misc/custom-hooks';
import { auth, database } from '../misc/firebase';

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Group name is required'),
  description: StringType().isRequired('Group description is required'),
});
const INITIAL_FORM = {
  name: '',
  description: '',
};
const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);
  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const newGroupData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid]: true,
      },
    };
    try {
      await database.ref('groups').push(newGroupData);
      Alert.info(`${formValue.name} group is created`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };
  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="group" /> Create new group
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Group name</ControlLabel>
              <FormControl name="name" placeholder="Enter group name..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Group description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter group description..."
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            disabled={isLoading}
            onClick={onSubmit}
          >
            Create new group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
