import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDjcYKdnaq-L0jnx4fDz_o8Y6itONKjuUQ',
  authDomain: 'aymar-27001.firebaseapp.com',
  databaseURL: 'https://aymar-27001-default-rtdb.firebaseio.com',
  projectId: 'aymar-27001',
  storageBucket: 'aymar-27001.appspot.com',
  messagingSenderId: '533560915632',
  appId: '1:533560915632:web:273516a3c9c98865f3ad75',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
