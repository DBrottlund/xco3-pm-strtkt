"use client";

import React, { useState, useEffect } from 'react';

function UserDropdown({ users, selectedUserId,setAssigneeId, onUserSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState(users);

  useEffect(() => {
    console.log("Selected User ID:", selectedUserId, users);
    if (users.length > 0 && selectedUserId) {
      const user = users.find(u => u.id === selectedUserId);
      setSelectedUser(user || null);
    }
    setUserList(users);
  }, [selectedUserId, users]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setAssigneeId(user.id)
    onUserSelect(user.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedUser ? (
          <div>
            <span>{`${selectedUser.firstName} ${selectedUser.lastName}`}</span>
            <span className="block text-xs uppercase text-gray-500">{selectedUser.email}</span>
          </div>
        ) : (
          'Select User'
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isOpen && userList && userList.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {userList.map((user) => (
            <li
              key={user.id}
              className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
              onClick={() => handleUserSelect(user)}
            >
              <div>
                <span className="block">{`${user.firstName} ${user.lastName} (${user.role})`}</span>
                <span className="block text-xs uppercase text-gray-500 group-hover:text-white">{user.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserDropdown;