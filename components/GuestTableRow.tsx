import React, { useState } from 'react';
import firebase from '../firebase/clientApp';

interface GuestTableRowProps {
  guest: {
    firstName: string;
    lastName: string;
    color: string;
    timestamp: Date;
    staffName: string;
  };
  //onDelete: (id: string) => void;
}

export default function GuestTableRow({ guest }: GuestTableRowProps) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    let guestKey: string = guest.firstName + ' ' + guest.lastName;
    guestKey = guestKey.toUpperCase();

    if (window.confirm('Are you sure you want to delete ' + guestKey + "?")) {
      firebase.firestore().collection('guests').doc(guestKey).delete();
      setDeleted(true);
    }
  };

  return (
    <tr className={deleted ? 'text-gray-400 line-through' : ''}>
      <td className="uppercase">{guest.firstName}</td>
      <td className="uppercase">{guest.lastName}</td>
      <td>
        <span
          className={`px-2 py-1 rounded-lg font-bold text-white ${
            guest.color === 'green'
              ? 'bg-green-500'
              : guest.color === 'yellow'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        >
          {guest.color}
        </span>
      </td>
      <td>{guest.timestamp.toDateString()}</td>
      <td className="uppercase">{guest.staffName}</td>
      <td>
        <button 
          onClick={handleDelete}
          disabled={ deleted }
          className={deleted ? 'bg-slate-200 text-slate-300  font-bold py-2 px-4 rounded' : 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}