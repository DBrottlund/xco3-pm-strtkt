import { FaTrash } from 'react-icons/fa';

const TasksEditor = ({ isOpen, setIsOpen }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...localTasks];
    newTasks[index][field] = value;
    setLocalTasks(newTasks);
  };

  const addTask = () => {
    setLocalTasks([...localTasks, { id: Date.now().toString(), title: '', taskText: '', completedAt: null }]);
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
      <Dialog as="div" className="relative z-[9999999]" onClose={() => setIsOpen(false)}>
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
                  {localTasks && localTasks.map((task, index) => (
                    <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={!!task.completedAt}
                          onChange={(e) => handleTaskChange(index, 'completedAt', e.target.checked ? new Date().toISOString() : null)}
                          className="mr-2 rounded"
                        />
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
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
                        onChange={(e) => handleTaskChange(index, 'taskText', e.target.value)}
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