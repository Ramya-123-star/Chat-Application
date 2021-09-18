/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Divider, Tag } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');
const shouldScrollToBottom = (node, threshold = 20) => {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
  return percentage > threshold;
};

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;
  const userId = auth.currentUser.uid;
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();
  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messagesRef.off();
      messagesRef
        .orderByChild('groupId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrWithId(snap.val());
          setMessages(data);
          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );
  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;
    loadMessages(limit);
    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 1000);
  }, [limit, loadMessages]);
  useEffect(() => {
    const node = selfRef.current;
    loadMessages();
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 1000);
    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);
  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/groups/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Revoked admin permission';
          } else {
            admins[uid] = true;
            alertMsg = 'Granted admin permission';
          }
        }
        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );
  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;
    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'UnLiked ';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Liked';
        }
      }
      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);
  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message ? ')) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/groups/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/groups/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.success('Message deleted');
      } catch (err) {
        return Alert.error(err.message);
      }
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message);
        }
      }
    },
    [chatId, messages]
  );
  const renderMessage = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <Divider key={date} className="text-center mb-1 padded">
          <Tag color="cyan">{date}</Tag>
        </Divider>
      );
      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          userId={userId}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul className="msg-list custom-scroll" ref={selfRef}>
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="violet">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messsages yet</li>}
      {canShowMessage && renderMessage()}
    </ul>
  );
};

export default Messages;
