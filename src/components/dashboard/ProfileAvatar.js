import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../../misc/helpers';

const ProfileAvatar = ({ name, ...avatarProps }) => {
  return (
    <Avatar
      circle
      style={{ backgroundColor: 'darkblue', color: 'gold' }}
      {...avatarProps}
    >
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
