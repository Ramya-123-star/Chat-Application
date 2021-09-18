import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  Icon,
  InputGroup,
  Loader,
  Modal,
  Uploader,
} from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;
const AttachmentBtnModal = ({ afterUpload }) => {
  const { isOpen, open, close } = useModalState();
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { chatId } = useParams();
  const handleChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };
  const onUpload = async () => {
    try {
      setIsLoading(true);
      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, { cacheControl: `public/${3600 * 24 * 3}` });
      });
      const uploadSnapshots = await Promise.all(uploadPromises);
      const shapePromises = uploadSnapshots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });
      const files = await Promise.all(shapePromises);
      await afterUpload(files);
      setIsLoading(false);
      setFileList([]);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open} color="blue">
        <Icon icon="attachment" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-3">
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={handleChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          >
            <span style={{ backgroundColor: 'blue', color: 'white' }}>
              Select files
            </span>
          </Uploader>
          {isLoading && <Loader center vertical size="md" speed="slow" />}
        </Modal.Body>
        <Modal.Footer>
          <Button block color="green" disabled={isLoading} onClick={onUpload}>
            Upload
          </Button>
          <div className="text-right mt-2">
            <strong>
              <span style={{ color: 'red' }}>*</span> Files below 5mb are only
              allowed
            </strong>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
