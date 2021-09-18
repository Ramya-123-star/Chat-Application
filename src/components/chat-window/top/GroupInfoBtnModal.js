import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentGroup } from '../../../context/current-group.context';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const description = useCurrentGroup(v => v.description);
  const name = useCurrentGroup(v => v.name);
  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Group info
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Group name : {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className=" mt-2 mb-1">Description :</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="ghost" block color="red" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(RoomInfoBtnModal);
