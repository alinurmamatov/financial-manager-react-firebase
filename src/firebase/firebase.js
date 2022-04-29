import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, set, ref, push, child, onValue, val } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCwn3YKhB8iOg7hVfoDTr-d23-qjw1dH_o",
  authDomain: "financial-manager-fecfc.firebaseapp.com",
  databaseURL: "https://financial-manager-fecfc-default-rtdb.firebaseio.com",
  projectId: "financial-manager-fecfc",
  storageBucket: "financial-manager-fecfc.appspot.com",
  messagingSenderId: "62327494758",
  appId: "1:62327494758:web:ae4cf32a25fea1596e75a7",
  measurementId: "G-Z397ZP6PKQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const readTransaction = (callback) => {
    const db = getDatabase();
    const starCounterRef = ref(db, "transactions");
    onValue(starCounterRef, (snapshot) => {
        const data = snapshot.val();
        callback(data)
    })
} 

export const createTransaction = (title, amount, type) => {
    const db = getDatabase();
    //let key = Math.floor(Math.random() * 1000000);
    const key = push(child(ref(db), "transactions")).key;
    set(ref(db, `transactions/${key}`), {
        title,
        amount, 
        type
    });
}