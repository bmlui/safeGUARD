import { useState, useEffect } from 'react';
import firebase from '../firebase/clientApp';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Auth() {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // Check if user's email is in approved list in Firestore
        const userEmail = user.email;
        if (userEmail) {
          try {
            const approvedEmailsRef = firebase.firestore().collection('approvedEmails').doc(userEmail);
            const doc = await approvedEmailsRef.get(); // Await for the document retrieval
            if (doc.exists) {
              router.push('/guests');
            } else {
              alert('Error. Your account must be approved for access.');
              await firebase.auth().signOut();
            }
          } catch (error) {
            console.error('Error checking approved emails:', error);
            alert('Error checking approved emails. Please try again later.');
            await firebase.auth().signOut();
          }
        } else {
          alert('Error. No email found for this user.');
          await firebase.auth().signOut();
        }
      } else {
        setUser(null);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Failed to sign in with Google. Please try again later.');
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out. Please try again later.');
    }
  };

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
