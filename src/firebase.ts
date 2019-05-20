import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAowqJnCpZiAQbBhYNpEfN_juXgcuJ-9hg",
  authDomain: "my-northstar-dev.firebaseapp.com",
  databaseURL: "https://my-northstar-dev.firebaseio.com",
  projectId: "my-northstar-dev",
  storageBucket: "my-northstar-dev.appspot.com",
  messagingSenderId: "1061711582934"
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();

export default firebase;
