import React, { useEffect, useState } from 'react';
import firebase from '../firebase/clientApp';
import GuestTableRow from '../components/GuestTableRow';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [color, setColor] = useState('');
  const [staffName, setStaffName] = useState('');


  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      const guestsCollection = await firebase.firestore().collection('guests').get();
      const guestList = guestsCollection.docs.map((doc: any) => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp.toDate() }));
      setGuests(guestList);
    };

    fetchGuests();
  }, []);

  const filteredGuests = guests.filter((guest) =>
    guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
    setStaffName("");
    alert(guestKey + " has been added to the list.");
  };



  
  
  return (
    <div>
      <div className="bg-gray-200 h-24"></div>
    <div className="bg-gray-200 flex justify-center items-center">
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

    <div className="bg-gray-200 h-10"></div>
     <div className="bg-gray-200  flex justify-center items-center">
     <div className="max-w-2xl w-full bg-white p-6 rounded-lg">
       <input
         type="text"
         placeholder="Search by name..."
         className="border border-gray-300 rounded px-3 py-2 mb-4"
         value={searchTerm}
         onChange={(event) => setSearchTerm(event.target.value)}
       />
       <table className="table-auto w-full">
         <thead>
           <tr>
             <th className="px-4 py-2">First</th>
             <th className="px-4 py-2">Last</th>
             <th className="px-4 py-2">Color</th>
             <th className="px-4 py-2">Date</th>
             <th className="px-4 py-2">Staff</th>
             
           </tr>
         </thead>
         <tbody>
           {filteredGuests.map((guest) => (
             <GuestTableRow key={guest.id} guest={guest} />
           ))}
         </tbody>
       </table>
     </div>
   </div>

   <div className="bg-gray-200 h-24"></div>
   </div>
  );
}
