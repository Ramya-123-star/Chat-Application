import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite';
import { useGroups } from '../../context/groups.context';
import GroupItem from './GroupItem';

const GroupList = ({ aboveElHeight }) => {
  const groups = useGroups();
  const location = useLocation();
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{ height: `calc(100% - ${aboveElHeight}px)` }}
      activeKey={location.pathname}
    >
      {!groups && (
        <Loader center vertical content="Loading..." size="md" speed="slow" />
      )}
      {groups &&
        groups.length > 0 &&
        groups.map(group => (
          <Nav.Item
            key={group.id}
            componentClass={Link}
            to={`/chat/${group.id}`}
            eventKey={`/chat/${group.id}`}
          >
            <GroupItem group={group} />
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default GroupList;
