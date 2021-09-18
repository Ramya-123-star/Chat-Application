import React from 'react';
import { Badge, Tooltip, Whisper } from 'rsuite';
import { usePresence } from '../misc/custom-hooks';

const getColor = presence => {
  if (!presence) {
    return 'gray';
  }
  switch (presence.state) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    default:
      return 'gray';
  }
};

const getText = presence => {
  if (!presence) {
    return 'Status unknown';
  }
  return presence.state === 'online'
    ? 'Online'
    : `Last online : ${new Date(
        presence.last_changed
      ).toLocaleDateString()} ${new Date(
        presence.last_changed
      ).toLocaleTimeString()}`;
};

const PresenceDot = ({ uid, direction }) => {
  const presence = usePresence(uid);
  return (
    <Whisper
      placement={direction}
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence), marginLeft: '10px' }}
      />
    </Whisper>
  );
};

export default PresenceDot;
