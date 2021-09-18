import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import ChatTop from '../../components/chat-window/top';
import Messages from '../../components/chat-window/messages';
import ChatBottom from '../../components/chat-window/bottom';
import { useGroups } from '../../context/groups.context';
import { CurrentGroupProvider } from '../../context/current-group.context';
import { transformToArr } from '../../misc/helpers';
import { auth } from '../../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();
  const groups = useGroups();
  if (!groups) {
    return (
      <Loader center vertical size="md" content="Loading..." speed="slow" />
    );
  }
  const currentGroup = groups.find(group => group.id === chatId);
  if (!currentGroup) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }
  const { name, description } = currentGroup;
  const admins = transformToArr(currentGroup.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);
  const currentGroupData = { name, description, admins, isAdmin };
  return (
    <CurrentGroupProvider data={currentGroupData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle ">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentGroupProvider>
  );
};

export default Chat;
