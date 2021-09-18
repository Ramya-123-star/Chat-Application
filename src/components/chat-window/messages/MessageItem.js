import React, { memo } from 'react';
import { Button, Icon, Tag } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentGroup } from '../../../context/current-group.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage = (file, isAuthor) => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }
  if (file.contentType.includes('mp3')) {
    return (
      <Tag
        color={isAuthor ? 'green' : 'blue'}
        className="word-break-all"
        style={{ fontSize: '10px' }}
      >
        {
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio controls>
            <source src={file.url} type="audio/mp3" />
            Your browser does not support audio element
          </audio>
        }
      </Tag>
    );
  }
  return (
    <Tag
      style={{ fontSize: '16px' }}
      color={isAuthor ? 'green' : 'blue'}
      className="word-break-all"
    >
      <a href={file.url} style={{ color: 'white' }}>
        <span className="word-break-all" style={{ marginRight: '5px' }}>
          {file.name}
        </span>
        <Icon icon="download" />
      </a>
    </Tag>
  );
};

const MessageItem = ({
  message,
  userId,
  handleAdmin,
  handleLike,
  handleDelete,
}) => {
  const { author, createdAt, text, file, likes, likeCount } = message;
  const isAdmin = useCurrentGroup(v => v.isAdmin);
  const admins = useCurrentGroup(v => v.admins);
  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = userId === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const [selfRef, isHovered] = useHover();
  const isLiked = likes && Object.keys(likes).includes(userId);
  const isMobile = useMediaQuery('(max-width: 992px)');
  const canShowIcons = isMobile || isHovered;
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      style={{
        textAlign: isAuthor && 'right',
        marginLeft: isMobile && isAuthor && '80px',
        marginRight: isMobile && !isAuthor && '80px',
      }}
      ref={selfRef}
    >
      <div
        className="d-flex align-items-center font-bolder mb-1"
        style={isAuthor ? { justifyContent: 'flex-end' } : {}}
      >
        {isAuthor && (
          <IconBtnControl
            tooltip="Delete this message"
            isVisible={canShowIcons}
            iconName="close"
            onClick={() => handleDelete(message.id, file)}
          />
        )}
        {isAuthor && (
          <IconBtnControl
            {...(isLiked ? { color: 'red' } : {})}
            isVisible={canShowIcons}
            iconName="heart"
            onClick={() => handleLike(message.id)}
            badgeContent={likeCount}
          />
        )}
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="sm"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-2 text-black"
        >
          {canGrantAdmin && (
            <Button
              block
              onClick={() => handleAdmin(author.uid)}
              color={isMsgAuthorAdmin ? 'orange' : 'yellow'}
            >
              {isMsgAuthorAdmin
                ? 'Revoke admin permission'
                : 'Grant admin permission'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        {!isAuthor && (
          <IconBtnControl
            {...(isLiked ? { color: 'red' } : {})}
            isVisible={canShowIcons}
            iconName="heart"
            onClick={() => handleLike(message.id)}
            badgeContent={likeCount}
          />
        )}
      </div>
      <div>
        {text && (
          <Tag
            style={{ fontSize: '16px' }}
            color={isAuthor ? 'green' : 'blue'}
            className="word-break-all"
          >
            {text}
          </Tag>
        )}
        {file && renderFileMessage(file, isAuthor, isMobile)}
      </div>
      <div>
        {isAuthor && <PresenceDot uid={author.uid} direction="left" />}

        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        {!isAuthor && <PresenceDot uid={author.uid} direction="right" />}
      </div>
    </li>
  );
};

export default memo(MessageItem);
