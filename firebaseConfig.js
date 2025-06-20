import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyATcjfhkcDh0kCZ4VVpLFQK4Zgqz7uJDLU",
  authDomain: "trac-nghiem-tin-hoc.firebaseapp.com",
  databaseURL: "https://trac-nghiem-tin-hoc-default-rtdb.firebaseio.com/", // thêm dòng này
  projectId: "trac-nghiem-tin-hoc",
  storageBucket: "trac-nghiem-tin-hoc.appspot.com",
  messagingSenderId: "602736953722",
  appId: "1:602736953722:web:320ebf445bef09790eeec3",
  measurementId: "G-Z243SMHJQJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
