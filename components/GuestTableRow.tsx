import React from 'react';

interface GuestTableRowProps {
  guest: {
    firstName: string;
    lastName: string;
    color: string;
    timestamp: Date;
    staffName: string;
  };
  onDelete: (id: string) => void;
}

export default function GuestTableRow({ guest, onDelete }: GuestTableRowProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      onDelete(guest.id);
    }
  };

  return (
    <tr>
      <td>{guest.firstName}</td>
      <td>{guest.lastName}</td>
      <td>
        <span
          className={`px-2 py-1 rounded-lg font-bold text-white ${guest.color === 'green' ? 'bg-green-500' : guest.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
        >
          {guest.color}
        </span>
      </td>
      <td>{guest.timestamp.toDateString()}</td>
      <td>{guest.staffName}</td>
      <td>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      </td>
    </tr>
  );
}