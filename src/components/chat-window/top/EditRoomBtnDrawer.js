import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentGroup } from '../../../context/current-group.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import { database } from '../../../misc/firebase';
import EditableInput from '../../EditableInput';

const EditRoomBtnDrawer = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px)');
  const { chatId } = useParams();
  const name = useCurrentGroup(v => v.name);
  const description = useCurrentGroup(v => v.description);
  const updateData = (key, value) => {
    database
      .ref(`groups/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Successfully updated', 4000);
        close();
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };
  const onNameSave = newName => {
    updateData('name', newName);
  };
  const onDescSave = newDesc => {
    updateData('description', newDesc);
  };
  return (
    <div>
      <Button color="red" className="br-circle" size="sm" onClick={open}>
        A
      </Button>
      <Drawer show={isOpen} onHide={close} placement="right" full={isMobile}>
        <Drawer.Header>
          <Drawer.Title>Edit Group</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name cannot be empty"
            wrapperClassName="mt-3"
          />
          <EditableInput
            componentClass="textarea"
            rows={5}
            initialValue={description}
            onSave={onDescSave}
            label={<h6 className="mb-2">Description</h6>}
            emptyMsg="Description cannot be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block color="red" appearance="ghost" onClick={close}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomBtnDrawer);
