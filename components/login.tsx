import { useState, useEffect } from 'react';
import firebase from '../firebase/clientApp';
import { useRouter } from 'next/router';
import {useAuthState} from "react-firebase-hooks/auth";

export default function Auth() {
  
const [user, setUser] = useState<any | null>(null);
const router = useRouter();

useEffect(() => {
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setUser(user);
      if (user.uid === "wEomp6cjiDQhTdHGvH5amDFX51U2" || user.uid === "m6mu4pzXq9UVjDws80CVLshugme2") {
        router.push("/guests");
      } else {
        alert("Error. Your account must be approved for access.");
       firebase.auth().signOut();
      }
    } else {
      setUser(null);
      router.push("/");
    }
  });

  return () => unsubscribe();
}, []);

const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebase.auth().signInWithPopup(provider);
  } catch(error ) {
    console.log(error);
  }

}

const signOut = async () => {
  await firebase.auth().signOut();
}


  return (
    <div className="flex flex-col items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {user ? (
          <div className="text-center">
            <p className="text-lg font-bold">Welcome, {user.displayName}! | safeGUARD</p>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <div className='text-center'>
            <p className="text-lg font-bold">safeGUARD</p>
            <p className="">For use by client facilities only</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
        )}
      </div>
    </div>
  );
}