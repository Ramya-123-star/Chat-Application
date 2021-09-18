/* eslint-disable no-param-reassign */
export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(' ');
  return splitName.length > 1
    ? splitName[0][0] + splitName[1][0]
    : splitName[0][0];
}
export function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}
export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(groupId => {
        return { ...snapVal[groupId], id: groupId };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;
  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getGroups = db
    .ref('groups')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');
  const [mSnap, gSnap] = await Promise.all([getMsgs, getGroups]);
  mSnap.forEach(msgSnap => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });
  gSnap.forEach(groupSnap => {
    updates[
      `/groups/${groupSnap.key}/lastMessage/author/${keyToUpdate}`
    ] = value;
  });
  return updates;
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);
    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }
    result[groupingKey].push(item);
    return result;
  }, {});
}
