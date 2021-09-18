import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../misc/firebase';
import { transformToArrWithId } from '../misc/helpers';

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    const GroupsListRef = database.ref('groups');
    GroupsListRef.on('value', snap => {
      const data = transformToArrWithId(snap.val());
      setGroups(data);
    });
    return () => {
      if (GroupsListRef) {
        GroupsListRef.off();
      }
    };
  }, []);

  return (
    <GroupsContext.Provider value={groups}>{children}</GroupsContext.Provider>
  );
};

export const useGroups = () => useContext(GroupsContext);
