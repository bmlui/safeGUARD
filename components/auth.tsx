import React, { useEffect, useState } from 'react';
import firebase from "../firebase/clientApp";

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display GitHub as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};


const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signIn = () => auth.signInWithPopup(provider);
const signOut = () => auth.signOut();


function SignInScreen({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
      firebase.auth().onAuthStateChanged(async (user) => {
        setUser(user);
      });
    }, []);
    return (
      <Component 
        {...pageProps} 
        user={user} 
        signIn={signIn} 
        signOut={signOut} 
      />
    );
  }

export default SignInScreen;