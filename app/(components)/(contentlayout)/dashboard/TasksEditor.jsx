import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DraggableTaskList from './DraggableTaskList';
import { createTasks, updateTask, deleteTask } from "@/shared/actions";

const TasksEditor = ({ isOpen, setIsOpen, requestId, tasks: initialTasks, setTasks: setParentTasks }) => {
  const [localTasks, setLocalTasks] = useState(initialTasks);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalTasks(initialTasks);
  }, [initialTasks]);

  const handleTaskChange = (updatedTasks) => {
    setLocalTasks(updatedTasks);
  };

  const addTask = () => {
    const newTask = {
      id: `temp-${Date.now()}`,
      title: "",
      taskText: "",
      completedAt: null,
    };
    setLocalTasks(prevTasks => [...prevTasks, newTask]);
  };

  const saveTasks = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const newTasks = localTasks.filter((task) => task.id.startsWith("temp-"));
      const updatedTasks = localTasks.filter((task) => !task.id.startsWith("temp-"));
      const deletedTaskIds = initialTasks
        .filter((task) => !localTasks.some((localTask) => localTask.id === task.id))
        .map((task) => task.id);

      if (newTasks.length > 0) {
        const result = await createTasks(newTasks.map((task) => ({ requestId, ...task })));

        if (result.success && Array.isArray(result.data)) {
          setLocalTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id.startsWith("temp-")
                ? result.data.find((t) => t.title === task.title && t.taskText === task.taskText) || task
                : task
            )
          );
        } else {
          console.error("Failed to create tasks:", result.error || "Unknown error");
          setError("Failed to create new tasks. Please try again.");
          return;
        }
      }

      for (const task of updatedTasks) {
        await updateTask(task.id, task);
      }

      for (const taskId of deletedTaskIds) {
        await deleteTask(taskId);
      }

      setParentTasks(localTasks);
      setIsOpen(false);
    } catch (err) {
      console.error("Error in saveTasks:", err);
      setError("Failed to save tasks. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Edit Tasks
                </Dialog.Title>
                <div className="mt-2">
                  <DraggableTaskList tasks={localTasks} setTasks={handleTaskChange} />
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={addTask}
                  >
                    Add Task
                  </button>
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                      onClick={saveTasks}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 text-red-500 bg-red-100 p-2 rounded-md">
                    {error}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TasksEditor;