import { useState, useEffect } from 'react';
import firebase from '../firebase/clientApp';
import { Router } from 'next/router';

export default function Auth() {
  
const [user, setUser] = useState<any | null>(null);

useEffect(() => {
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);

const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithPopup(provider);
}

const signOut = async () => {
  await firebase.auth().signOut();
}


  return (
    <div className="flex flex-col items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {user ? (
          <div className="text-center">
            <p className="text-lg font-bold">Welcome, {user.displayName}!</p>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <div >
            <p className="text-lg text-center font-bold"> Please Login</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
        )}
      </div>
    </div>
  );
}