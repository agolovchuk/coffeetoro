import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD6Gh8ANPBe0sq2gLuPNOcVD5LVaKuA2AI",
  authDomain: "coffeetoro.firebaseapp.com",
  databaseURL: "https://coffeetoro.firebaseio.com",
  storageBucket: 'coffeetoro.appspot.com',
}

firebase.initializeApp(config);

export const database = firebase.database;