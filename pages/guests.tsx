// @ts-nocheck
import React, { useEffect, useState } from 'react';
import firebase from '../firebase/clientApp';
import GuestTableRow from '../components/GuestTableRow';
import Login from '../components/login';

export default function Home() {

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [color, setColor] = useState('');
  const [staffName, setStaffName] = useState<string>('');


  const [guests, setGuests] = useState<[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  let disconected = false;
 
  firebase.database().ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() === false) {
      disconected = true;
    } else {
      disconected = false;
    }
  });
  

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        firebase.database().ref('guests').on('value', (snapshot) => {
          const guestList: any = [];
          snapshot.forEach((childSnapshot) => {
            const id = childSnapshot.key;
            const data = childSnapshot.val();
            const timestamp = new Date(data.timestamp);
            guestList.push({ id, ...data, timestamp });
          });
          setGuests(guestList);
        });
      } catch(err:any) {
        alert(err)
      }
    };
    fetchGuests();
  }, []);

  const filteredGuests:Array<any> = guests.filter((guest) =>
    guest.id.toLowerCase().replace(/[^A-Za-z]/g, '').includes(searchTerm.toLowerCase().replace(/[^A-Za-z]/g, ''))
  );



  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (disconected) {
      alert('You are not connected to the internet. Please connect to the internet and try again.');
      return;
    } 

    const colorOptions = ["green", "yellow", "red"];
    if (!colorOptions.includes(color)) {
      alert('Please select a valid color');
      return;
    }
    let correctedFirstName = (firstName.replace(/[^A-Za-z]/g, ''));
    let correctedLastName = (lastName.replace(/[^A-Za-z]/g, ''));
    if (correctedFirstName === '' || correctedLastName === '') {
      alert('Please enter a valid first and last name');
      return;
    }
    let corrrectedStaffName =  (staffName.replace(/[^A-Za-z ]/g, ''));
    if (corrrectedStaffName.replace(/[^A-Za-z]/g, '') === '') {
      alert('Please enter a valid staff name');
      return;
    }


    let guestID:string = correctedFirstName + ' ' + correctedLastName;
    guestID = guestID.toUpperCase();
    const doctest = firebase.database().ref('guests/' + guestID);
    const snapshot = await doctest.once('value');
    if (!snapshot.exists()) {
      const timestamp = new Date();
      let newGuest = { firstName: correctedFirstName, lastName: correctedLastName, color, timestamp: timestamp.getTime(), staffName:corrrectedStaffName };
      try {
        await firebase.database().ref('guests/' + guestID).set(newGuest);
      }
      catch(err:any) {
        alert(err);
      }
    } else {
      alert('Guest ' + guestID + ' already exists!');
      return;
    }

    // Clear form inputs
    setFirstName('');
    setLastName('');
    // alert(guestKey + " has been added to the list.");
    return;
  };
  
  
  return (
    <div>
   
   <div className="bg-gray-200 h-14"></div>
      <Login></Login>{  }
      <div className="bg-gray-200 h-10"></div>
    <div className="bg-gray-200 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Swim Test Log</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label htmlFor="firstName" className="mb-1 font-semibold">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              required pattern="[A-Za-z.-' ]{1,32}"
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
              required pattern="[A-Za-z.-' ]{1,32}"
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
              Tester Name:
            </label>
            <input
              type="text"
              id="staffName"
              required pattern="{[a-zA-Z.-' ]1,40}"
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
     <div className="bg-gray-200 pb-100 flex justify-center items-center">
     <div className="max-w-3xl w-full bg-white p-6 rounded-lg">
       <input
         type="text"
         placeholder="Search by name..."
         className="border border-gray-300 rounded px-3 py-2 mb-4"
         value={searchTerm}
         onChange={(event) => setSearchTerm(event.target.value)}
       />
       <table className="table-auto min-w-full divide-y divide-gray-200">
         <thead>
           <tr className="hidden md:table-row">
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
