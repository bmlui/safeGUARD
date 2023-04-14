import React, { useState } from 'react';
import firebase from '../firebase/clientApp';
import { useRouter } from "next/navigation";

interface GuestTableRowProps {
  guest: {
    id: string;
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
  let disconected = false;

  firebase.database().ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() === false) {
      disconected = true;
    } else {
      disconected = false;
    }
  });

  const handleDelete = () => {
    let guestKey: string = guest.id;

    if (window.confirm('Are you sure you want to delete ' + guestKey + "?")) {

      if (disconected) {
        alert("You are not connected to the internet. Please connect to the internet and try again.");
        return;
      }
      const guestRef = firebase.database().ref('guests/' + guestKey);
      guestRef.remove()
        .then(() => {
          setDeleted(true);
        })
        .catch((error: any) => {
          console.error('Error removing guest:', error);
          alert('Error removing guest: ' + error);
        });
    }
  };

  const nothing = () => {
    //console.log("nothing");
  }
  return (

    <tr className={deleted ? 'text-gray-400 line-through md:odd:bg-white md:even:bg-slate-50' : 'md:odd:bg-white md:even:bg-slate-50'}>
      <td className="hidden md:table-cell pl-4">{guest.firstName}</td>
      <td className="hidden md:table-cell">{guest.lastName}</td>
      <td>
        <span
          className={`hidden md:table-cell px-2 py-1 rounded-lg font-bold ${
            guest.color === 'green'
              ? 'bg-emerald-100/60 text-emerald-500'
              : guest.color === 'yellow'
              ? 'bg-amber-100/60 text-amber-500'
              : 'bg-red-100/60 text-red-500'
          }`}
        >
          {guest.color}
        </span>
      </td>
      <td className="hidden md:table-cell text-gray-500 whitespace-nowrap">{guest.timestamp.toLocaleDateString('en-US')}</td>
      <td className="hidden md:table-cell whitespace-nowrap">{guest.staffName}</td>
      <td className="hidden md:table-cell text-end pr-4">
        <button 
          onClick={handleDelete}
          disabled={ deleted }
          className={deleted ? 'text-slate-300 ' : ' text-red-500 hover:text-red-400 py-1'}
        >Delete</button>
      </td >
      <td className="md:hidden text-sm cursor-pointer" id="mobiletable">
      <div className="grid grid-cols-1 gap-4 block"> <a onClick={deleted ?  nothing : handleDelete}>
    <div className="bg-white space-y-2 p-2 m-2 rounded shadow">
    <div className="flex items-center space-x-2 text-sm">
      <div className='font-bold text-base'>{guest.firstName} {guest.lastName}</div>
      <div
          className={`md:hidden px-2 py-1 rounded-lg font-semibold  ${
            guest.color === 'green'
              ? 'bg-emerald-100/60 text-emerald-500'
              : guest.color === 'yellow'
              ? 'bg-amber-100/60 text-amber-500'
              : 'bg-red-100/60 text-red-500'
          }`}
        >
          {guest.color}
        </div>

    </div>
    <span className="text-gray-500">{guest.timestamp.toLocaleDateString('en-US')}</span>
    <span className=''> {guest.staffName}</span>

    </div>
    </a>
    </div>
    </td>
    
    </tr>
   
  );
}