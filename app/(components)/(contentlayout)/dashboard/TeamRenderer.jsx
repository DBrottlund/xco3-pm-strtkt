import React, { useState } from "react";
import Link from "next/link";
import { Transition, Dialog } from "@headlessui/react";
import Avatar from 'react-avatar';
import { removeAssigneeFromHistory } from "@/shared/actions"; // Adjust the import path as needed

export default function TeamMembersPopup({ data, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [request, setRequest] = useState(null);
  const userArray = Array.isArray(value) ? value.map(item => item.user) : [value];

  const openModal = (member) => {
    setSelectedMember(member);
    setRequest(data.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleRemoveAssignee = async () => {
    console.log('handleRemoveAssignee', selectedMember,request);
    if (!selectedMember || !request) return;

    setIsRemoving(true);
    try {
      const result = await removeAssigneeFromHistory(request, selectedMember.id);
      if (result.success) {
        // Handle successful removal (e.g., update local state, show a success message)
        closeModal();
      } else {
        // Handle failure (e.g., show an error message)
        console.error("Failed to remove assignee:", result.error);
      }
    } catch (error) {
      console.error("Error removing assignee:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  // Determine if the selected member is the current assignee
  const isCurrentAssignee = selectedMember && userArray[userArray.length - 1].id === selectedMember.id;
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 py-2">
      <div className="avatar-list-stacked">
        {userArray.map((item, index) => (
          <button
            key={index}
            onClick={() => openModal(item)}
            className="avatar avatar-sm avatar-rounded"
          >
            <Avatar
              name={`${item.firstName} ${item.lastName}`}
              size={index === userArray.length - 1 ? 30 : 25}
              round={true}
              src={item.profilePicture || undefined}
            />
          </button>
        ))}
        {/* <Link
          className="avatar avatar-sm bg-primary text-white avatar-rounded"
          href="#!"
          scroll={false}
        >
          +5
        </Link> */}
      </div>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    User Details
                  </Dialog.Title>
                  {selectedMember && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={`${selectedMember.firstName} ${selectedMember.lastName}`}
                          size="60"
                          round={true}
                          src={selectedMember.profilePicture || undefined}
                        />
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{`${selectedMember.firstName} ${selectedMember.lastName}`}</p>
                          <p className="text-sm text-gray-500">{selectedMember.role}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Username</p>
                        <p className="text-base text-gray-900">{selectedMember.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Email</p>
                        <p className="text-base text-gray-900">{selectedMember.email}</p>
                      </div>
                      {/* {!isCurrentAssignee && (
                        <div className="mt-4">
                          <button
                            onClick={handleRemoveAssignee}
                            disabled={isRemoving}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                          >
                            {isRemoving ? 'Removing...' : 'Remove from History'}
                          </button>
                        </div>
                      )} */}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}