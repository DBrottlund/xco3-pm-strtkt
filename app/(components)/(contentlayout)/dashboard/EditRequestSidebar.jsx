
"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { FaTrash } from "react-icons/fa";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
  });


const RequestEditSidebar = ({
  isVisible,
  setIsVisible,
  postData,
  placeholder = "Start typing...",
}) => {
  if (!postData) {
    return null;
  }

  const [title, setTitle] = useState(postData?.title ?? "");
  const [assigneeType, setAssigneeType] = useState(
    postData?.assigneeType ?? ""
  );
  const [originalRequest, setOriginalRequest] = useState(
    postData?.requestOriginal ?? ""
  );
  const [instructions, setInstructions] = useState(
    postData?.requestIntro ?? ""
  );
  const [notes, setNotes] = useState(postData?.requestOutro ?? "");
  const [tasks, setTasks] = useState(postData?.tasks ?? []);

  const [isInstructionsEditorOpen, setIsInstructionsEditorOpen] =
    useState(false);
  const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);
  const [isTasksEditorOpen, setIsTasksEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postData) {
      setTitle(postData.title ?? "");
      setAssigneeType(postData.assigneeType ?? "");
      setOriginalRequest(postData.requestOriginal ?? "");
      setInstructions(postData.requestIntro ?? "");
      setNotes(postData.requestOutro ?? "");
      setTasks(postData.tasks ?? []);
    }
  }, [postData]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Implement save logic here using Prisma
      setIsVisible(false);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const EditorPopup = ({ isOpen, setIsOpen, content, setContent, title }) => (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999999]"
        onClose={() => setIsOpen(false)}
      >
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <JoditEditor
                    value={content}
                    config={{ readonly: false }}
                    tabIndex={1}
                    onBlur={(newContent) => setContent(newContent)}
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  const TasksEditor = ({ isOpen, setIsOpen }) => {
    const [localTasks, setLocalTasks] = useState(tasks);

    const handleTaskChange = (index, field, value) => {
      const newTasks = [...localTasks];
      newTasks[index][field] = value;
      setLocalTasks(newTasks);
    };

    const addTask = () => {
      setLocalTasks([
        ...localTasks,
        {
          id: Date.now().toString(),
          title: "",
          taskText: "",
          completedAt: null,
        },
      ]);
    };

    const removeTask = (index) => {
      const newTasks = [...localTasks];
      newTasks.splice(index, 1);
      setLocalTasks(newTasks);
    };

    const saveTasks = () => {
      setTasks(localTasks);
      setIsOpen(false);
    };

    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999999]"
          onClose={() => setIsOpen(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Edit Tasks
                  </Dialog.Title>
                  <div className="mt-2 space-y-4">
                    {localTasks &&
                      localTasks.map((task, index) => (
                        <div
                          key={task.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={!!task.completedAt}
                              onChange={(e) =>
                                handleTaskChange(
                                  index,
                                  "completedAt",
                                  e.target.checked
                                    ? new Date().toISOString()
                                    : null
                                )
                              }
                              className="mr-2 rounded"
                            />
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) =>
                                handleTaskChange(index, "title", e.target.value)
                              }
                              className="flex-grow p-2 border rounded-md"
                              placeholder="Task title"
                            />
                            <button
                              onClick={() => removeTask(index)}
                              className="ml-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                          <textarea
                            value={task.taskText}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                "taskText",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder="Task description"
                            rows={3}
                          />
                        </div>
                      ))}
                    <button
                      onClick={addTask}
                      className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Add Task
                    </button>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      onClick={saveTasks}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      <Transition
        show={isVisible}
        as={Fragment}
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-lg z-[999999] overflow-y-auto">
          <div className="m-2 p-8 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Request</h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
            </div>
            {error && (
              <div className="text-red-500 mb-4 p-2 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee Type
                </label>
                <input
                  type="text"
                  value={assigneeType}
                  onChange={(e) => setAssigneeType(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Request
                </label>
                <textarea
                  value={originalRequest}
                  onChange={(e) => setOriginalRequest(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex flex-row space-x-4 justify-around m-4">

                  <button
                    onClick={() => setIsInstructionsEditorOpen(true)}
                    type="button"
                    className="ti-btn ti-btn-warning-full label-ti-btn 
!rounded-full"
                  >
                    <i className="ri-edit-line label-ti-btn-icon me-2 !rounded-full"></i>
                    Instructions
                  </button>

                  <button
                    onClick={() => setIsTasksEditorOpen(true)}
                    type="button"
                    className="ti-btn ti-btn-info-full label-ti-btn !rounded-full"
                  >
                    <i className="ri-edit-line label-ti-btn-icon me-2 !rounded-full"></i>
                    Tasks
                  </button>

                  <button
                    onClick={() => setIsNotesEditorOpen(true)}
                    type="button"
                    className="ti-btn ti-btn-success-full label-ti-btn !rounded-full"
                  >
                    <i className="ri-edit-line label-ti-btn-icon me-2 !rounded-full"></i>
                    Notes
                  </button>


              </div>
            </div>
            <div className="flex flex-col justify-end"></div>
<div className="flex justify-center items-center mt-6 ">
            <button
              onClick={handleSave}
              disabled={isSaving}
                    type="button"
                    className=            {`mt-6 w-1/2 py-2 justify-center text-center ti-btn ti-btn-primary-full label-ti-btn !rounded-full ${ isSaving ? "opacity-50 cursor-not-allowed" : ""}`}

                  >
                    {isSaving ?  <i className="ri-loader-2-fill text-[1rem] animate-spin">
                        </i> :  <i className="ri-save-line label-ti-btn-icon me-2 !rounded-full"></i> }
                   
                        {isSaving ? "Saving..." : "Update"}
                  </button>

</div>

          </div>
        </div>
      </Transition>

      <EditorPopup
        isOpen={isInstructionsEditorOpen}
        setIsOpen={setIsInstructionsEditorOpen}
        content={instructions}
        setContent={setInstructions}
        title="Edit Instructions"
      />

      <EditorPopup
        isOpen={isNotesEditorOpen}
        setIsOpen={setIsNotesEditorOpen}
        content={notes}
        setContent={setNotes}
        title="Edit Notes"
      />

      <TasksEditor
        isOpen={isTasksEditorOpen}
        setIsOpen={setIsTasksEditorOpen}
      />
    </>
  );
};

export default RequestEditSidebar;
