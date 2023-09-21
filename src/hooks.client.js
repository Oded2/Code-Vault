import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export function writeUserData(apiKey, userID, email, username, name, password) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "code-vault-c5663.firebaseapp.com",
    databaseURL:
      "https://code-vault-c5663-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "code-vault-c5663",
    storageBucket: "code-vault-c5663.appspot.com",
    messagingSenderId: "74765715916",
    appId: "1:74765715916:web:657ef2ac13479130753569",
    measurementId: "G-FF0CTW4C4G",
  };
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  set(ref(db, "users/" + userID), {
    email: email,
    username: username,
    name: name,
    password: password,
  });
}

export async function readUserData(apiKey, userId = "") {
  let final;
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "code-vault-c5663.firebaseapp.com",
    databaseURL:
      "https://code-vault-c5663-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "code-vault-c5663",
    storageBucket: "code-vault-c5663.appspot.com",
    messagingSenderId: "74765715916",
    appId: "1:74765715916:web:657ef2ac13479130753569",
    measurementId: "G-FF0CTW4C4G",
  };
  const app = initializeApp(firebaseConfig);
  const dbRef = ref(getDatabase(app));
  await get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    final = snapshot.val();
  });
  return final;
}

export function randomNum(min, max) {
  const difference = max - min;
  let rand = parseInt(Math.random() * difference + min);
  return rand;
}
export function addParams(link, params) {
  let value;
  for (let key in params) {
    value = params[key];

    link.searchParams.append(key, value);
  }
  return link.toString();
}
export function addParamsString(string, params) {
  const link = new URL("https://codevault.com");
  const linkWithParams = addParams(link, params);
  return linkWithParams.replace("https://codevault.com", string);
}

export async function fetchData(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    console.error(error);
    return false;
  }
  if (response.status != 200) {
    console.error(response.status);
    return false;
  }
  return response.json();
}

export function simplifyString(str) {
  for (let i = 0; i < str.length; i++) {
    str = str.replace(/\s/g, "").toLowerCase();
  }
  return str;
}
