import React from 'react';
import TimeAgo from 'timeago-react';
import ProfileAvatar from '../dashboard/ProfileAvatar';

const GroupItem = ({ group }) => {
  const { createdAt, name, lastMessage } = group;
  return (
    <div>
      <div className="d-flex justify-content-between align-item-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo
          datetime={new Date(lastMessage ? lastMessage.createdAt : createdAt)}
          className="font-normal text-black-45"
        />
      </div>
      <div className="d-flex align-items-center text-black-70">
        {lastMessage ? (
          <>
            <div className="d-flex align-items-center">
              <ProfileAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.name}
              />
            </div>
            <div className="text-disappear ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              <span>{lastMessage.text || lastMessage.file.name}</span>
            </div>
          </>
        ) : (
          <span>No messages yet...</span>
        )}
      </div>
    </div>
  );
};

export default GroupItem;
