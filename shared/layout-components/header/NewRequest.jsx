"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { DateTime } from 'luxon';

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  saveRequest as saveRequestAction
} from "@/shared/actions";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const NewRequestPopup = ({ isOpen, onClose, setIsOpen, session }) => {
  const [title, setTitle] = useState('')
  const [assigneeType, setAssigneeType] = useState('')
  const [status, setStatus] = useState('Request')
  const [assigneeId, setAssigneeId] = useState('')
  const [userId, setUserId] = useState(session?.user.id);
  const [originalRequest, setOriginalRequest] = useState('')
  const [instructions, setInstructions] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [dueAfterTimeNumber, setDueAfterTimeNumber] = useState(0)
  const [dueAfterTimeUnit, setDueAfterTimeUnit] = useState('DAY')
  const [turnaroundTimeNumber, setTurnaroundTimeNumber] = useState(0)
  const [turnaroundTimeUnit, setTurnaroundTimeUnit] = useState('DAY')

  const [currentUser, setCurrentUser] = useState(session?.user);

  useEffect(() => {
    if (currentUser) {
        setUserId(currentUser.id);
    }
    console.log(currentUser);
  }, [currentUser, session]);

  const handleSaveRequest = async () => {
    const updatedData = {
      title: title,
      assigneeType: assigneeType,
      status: status,
      assigneeId:  userId || currentUser.id ,
      requestOriginal: originalRequest,
      requestIntro: instructions,
      requestOutro: notes,
      startedAt: DateTime.now().setZone('America/Chicago'),
      createdById: userId || currentUser.id,
      assignedById: userId || currentUser.id,
      productTags: selectedProducts.map(option => option.value),
      dueAfterTime: {      
        timeNumber: dueAfterTimeNumber,
        timeUnit: dueAfterTimeUnit,        
      },      
      startedAt: new Date(),
      turnaroundTime: {      
        timeNumber: turnaroundTimeNumber,
        timeUnit: turnaroundTimeUnit,        
      },      
    };

    console.log('updatedData', updatedData);
    try {
      const updatedRequest = await saveRequestAction(updatedData);
      console.log('Request saved successfully', updatedRequest);
      onClose();
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[999999999999]" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:w-4/5 sm:h-4/5 max-w-4xl">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveRequest(); }}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={assigneeType}
                    onChange={(e) => setAssigneeType(e.target.value)}
                    placeholder="Assignee Type"
                    className="w-full p-2 border rounded"
                    
                  />
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Status"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    placeholder="Assignee ID"
                    className="w-full p-2 border rounded"
                    
                  />
                  <JoditEditor
                    value={originalRequest}
                    onChange={(content) => setOriginalRequest(content)}
                    className="w-full"
                  />
                  <JoditEditor
                    value={instructions}
                    onChange={(content) => setInstructions(content)}
                    className="w-full"
                  />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={dueAfterTimeNumber}
                      onChange={(e) => setDueAfterTimeNumber(parseInt(e.target.value))}
                      placeholder="Due After Time"
                      className="w-1/2 p-2 border rounded"
                      min="0"
                    />
                    <select
                      value={dueAfterTimeUnit}
                      onChange={(e) => setDueAfterTimeUnit(e.target.value)}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="HOUR">Hour</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={turnaroundTimeNumber}
                      onChange={(e) => setTurnaroundTimeNumber(parseInt(e.target.value))}
                      placeholder="Turnaround Time"
                      className="w-1/2 p-2 border rounded"
                      min="0"
                    />
                    <select
                      value={turnaroundTimeUnit}
                      onChange={(e) => setTurnaroundTimeUnit(e.target.value)}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="HOUR">Hour</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Request
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default NewRequestPopup