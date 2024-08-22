import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Checkbox, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const TaskCard = ({ task, index, onDelete, onToggle, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-md mb-4"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="text-blue-500"
              />
              <h3 className="text-lg font-semibold text-[#111c43]">{task.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="p-4">
              <textarea
                value={task.description}
                onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                className="w-full h-24 p-2 border border-gray-300 rounded-md text-[#111c43] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task description..."
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const DraggableTaskList = ({ tasks, setTasks }) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedTask);
    setTasks(newTasks);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleUpdate = (id, updates) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableTaskList;