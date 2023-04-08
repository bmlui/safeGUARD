import React, { useState } from 'react';
import firebase from '../firebase/clientApp';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [color, setColor] = useState('');
  const [staffName, setStaffName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const colorOptions = ["green", "yellow", "red"];
    if (!colorOptions.includes(color)) {
      alert('Please select a valid color');
      return;
    }

  if (firstName.includes(" ") || lastName.includes(" ")) {
    alert('Guest first and last names cannot include spaces.');
    return;
  }
  
    

    let guestKey = firstName + ' ' + lastName;
    guestKey = guestKey.toUpperCase();

    const doctest = firebase.firestore().collection('guests').doc(guestKey);
    const doc = await doctest.get();
    if (!doc.exists) {
      const timestamp = new Date();
      await firebase.firestore().collection('guests').doc(guestKey).set({ firstName, lastName, color, timestamp, staffName});
    } else {
      setFirstName('');
      setLastName('');
      setColor('');
      alert('Guest ' + guestKey + ' already exists!');
      return;
    }

    // Clear form inputs
    setFirstName('');
    setLastName('');
    setColor('');
    alert("");
  };
  
  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Guest List</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label htmlFor="firstName" className="mb-1 font-semibold">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              required pattern="[A-Za-z]{1,20}"
              className="border border-gray-300 rounded px-3 py-2"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="lastName" className="mb-1 font-semibold">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              required pattern="[A-Za-z]{1,20}"
              className="border border-gray-300 rounded px-3 py-2"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="color" className="mb-1 font-semibold">
              Color:
            </label>
            <select
              id="color"
              className="border border-gray-300 rounded px-3 py-2"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            >
              <option value="">Choose a color</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="lastName" className="mb-1 font-semibold">
              Staff Name:
            </label>
            <input
              type="text"
              id="staffName"
              required pattern="{1,40}"
              className="border border-gray-300 rounded px-3 py-2"
              value={staffName}
              onChange={(event) => setStaffName(event.target.value)}
            />
            </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add Guest
          </button>
        </form>
      </div>
    </div>
  );
}
