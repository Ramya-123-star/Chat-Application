import React, { useState } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import firebase from 'firebase/app';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });
  const [isLoadingUnlink, setIsLoadingUnlink] = useState({
    value: false,
    provider: null,
  });
  const [isLoadingLink, setIsLoadingLink] = useState(false);

  const updateIsConnected = (providerId, value) => {
    setIsConnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };
  const unlink = async providerId => {
    try {
      setIsLoadingUnlink({
        value: true,
        provider: providerId,
      });
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`Cannot disconnect from ${providerId}`);
      }
      await auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);
      setIsLoadingUnlink({
        value: false,
        provider: providerId,
      });
      Alert.info(`Disconnected from ${providerId}`);
    } catch (err) {
      setIsLoadingUnlink({
        value: false,
        provider: providerId,
      });
      Alert.error(err.message, 4000);
    }
  };
  const unlinkGoogle = () => {
    unlink('google.com');
  };
  const unlinkFacebook = () => {
    unlink('facebook.com');
  };
  const link = async provider => {
    try {
      setIsLoadingLink(true);
      await auth.currentUser.linkWithPopup(provider);
      Alert.info(`Linked to ${provider.providerId}`, 4000);
      setIsLoadingLink(false);
      updateIsConnected(provider.providerId, true);
    } catch (err) {
      setIsLoadingLink(false);
      Alert.error(err.message, 4000);
    }
  };
  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };
  const linkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };
  return (
    <div>
      {isConnected['google.com'] && (
        <Tag
          closable
          color={
            isLoadingUnlink.provider === 'google.com' && isLoadingUnlink.value
              ? ''
              : 'green'
          }
          onClose={unlinkGoogle}
        >
          <Icon icon="google-plus-circle" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag
          color={
            isLoadingUnlink.provider === 'facebook.com' && isLoadingUnlink.value
              ? ''
              : 'blue'
          }
          closable
          onClose={unlinkFacebook}
        >
          <Icon icon="facebook-official" /> Connected
        </Tag>
      )}
      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button
            color="green"
            appearance="ghost"
            block
            onClick={linkGoogle}
            disabled={isLoadingLink}
          >
            <Icon icon="google-plus-circle" /> Link to Google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button
            color="blue"
            appearance="ghost"
            block
            onClick={linkFacebook}
            disabled={isLoadingLink}
          >
            <Icon icon="facebook-official" /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
