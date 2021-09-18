import React from 'react';
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';

const ConditionalBadge = ({ condition, children }) => {
  return condition ? <Badge content={condition}>{children}</Badge> : children;
};
const IconBtnControl = ({
  isVisible,
  iconName,
  onClick,
  tooltip,
  badgeContent,
  ...props
}) => {
  return (
    <div
      className="ml-1"
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        marginRight: '6px',
      }}
    >
      <ConditionalBadge condition={badgeContent}>
        <Whisper
          placement="top"
          delay={0}
          delayHide={0}
          delayShow={0}
          trigger="hover"
          speaker={
            iconName === 'heart' ? (
              <Tooltip>
                {props.color ? 'Unlike this message' : 'Like this message'}
              </Tooltip>
            ) : (
              <Tooltip>{tooltip}</Tooltip>
            )
          }
        >
          <IconButton
            {...props}
            onClick={onClick}
            size="xs"
            circle
            icon={
              <Icon
                icon={iconName}
                style={iconName === 'close' ? { color: 'red' } : {}}
              />
            }
          />
        </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default IconBtnControl;
