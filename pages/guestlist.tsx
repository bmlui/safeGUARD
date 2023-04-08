import React, { useEffect, useState } from 'react';
import firebase from '../firebase/clientApp';
import GuestTableRow from '../components/GuestTableRow';

const GuestListPage = () => {
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

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Guest List</h1>
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
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Staff Name</th>
              
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
  );
};

export default GuestListPage;