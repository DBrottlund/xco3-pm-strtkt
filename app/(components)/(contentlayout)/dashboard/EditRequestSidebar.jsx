"use client";

import React, { Fragment, useState, useEffect } from "react";

import { Transition, Dialog, Disclosure } from "@headlessui/react";
import {
  createTasks,
  updateTask,
  deleteTask,
  updateRequest,
  setStatus
} from "@/shared/actions";
import { FaPlus, FaPlusCircle, FaTrash, FaChevronUp } from "react-icons/fa";
import dynamic from "next/dynamic";
import UserDropdown from "@/shared/components/UserDropdown";
import StatusBadgeRenderer from './StatusBadgeRenderer';
import { useSessionContext } from "@/app/(components)/(contentlayout)/layout";

import calculateFutureDate from "./calculateFutureDate";
import calculateWorkHoursPassed from "./calculateWorkHoursPassed";
import CustomJoditEditor from "./CustomJoditEditor";


const Select = dynamic(() => import("react-select"), { ssr: false });

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const modifyRequest = async (request, tasks = []) => {
  try {
    const deadline = await calculateFutureDate(
      request.dueAfterTime,
      request.startedAt
    );
    const deadlinePercent = await calculateWorkHoursPassed(
      request.startedAt,
      deadline
    );
    const allTags = [
      ...(request.productTags || []),
      ...(request.initiativesTags || []),
    ];

    return {
      ...request,
      deadline,
      deadlinePercent,
      allTags,
      tasks,
    };
  } catch (error) {
    console.error("Error in modifyRequest:", error);
    return request;
  }
};

const RequestEditSidebar = ({
  isVisible,
  setIsVisible,
  postData,
  users,
  setRowData,
  rowData,
  placeholder = "Start typing...",
}) => {
  if (!postData) {
    return null;
  }

  const { session, status } = useSessionContext();

	if (status === "loading") {
		return <div>Loading...</div>;
	  }
	
	  if (status === "unauthenticated") {
		return (
      <Fragment>

    <div>
      Not logged in
      </div>
      <Link href="/api/auth/signin" >
      Sign in
      </Link>
      </Fragment>
      )
	  }

  const handleUserSelect = (userId) => {
    setAssigneeId(userId);
  };

  const [dueAfterTimeNumber, setDueAfterTimeNumber] = useState(postData?.dueAfterTime?.timeNumber || 0);
  const [dueAfterTimeUnit, setDueAfterTimeUnit] = useState(postData?.dueAfterTime?.timeUnit || 'HOUR');

  const [turnaroundTimeNumber, setTurnaroundTimeNumber] = useState(
    postData?.turnaroundTime?.timeNumber || 0
  );
  const [turnaroundTimeUnit, setTurnaroundTimeUnit] = useState(
    postData?.turnaroundTime?.timeUnit || "HOUR"
  );


  const [currentUser, setCurrentUser] = useState(session?.user);
  
  const [userList, setUserList] = useState(users);

  const [title, setTitle] = useState(postData?.title ?? "");
  const [assigneeType, setAssigneeType] = useState(
    postData?.assigneeType ?? ""
  );
  const [assigneeId, setAssigneeId] = useState(postData?.assigneeId ?? "");
  const [reqStatus, setReqStatus] = useState(postData?.status ?? "Request");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [originalRequest, setOriginalRequest] = useState(
    postData?.requestOriginal ?? ""
  );
  const [instructions, setInstructions] = useState(
    postData?.requestIntro ?? ""
  );
  const [notes, setNotes] = useState(postData?.requestOutro ?? "");
  const [tasks, setTasks] = useState(postData?.tasks ?? []);
  const [aiContent, setAiContent] = useState(
    postData?.requestAIProcessed ?? ''
  );

  const [isInstructionsEditorOpen, setIsInstructionsEditorOpen] = useState(false);
  const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);
  const [isTasksEditorOpen, setIsTasksEditorOpen] = useState(false);
  const [isAIEditorOpen, setIsAIEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const productDropdownOptions = [
    { value: "ONBOARDING", label: "Onboarding" },
    { value: "ANALYST", label: "Analyst" },
    { value: "PIPELINE", label: "Pipeline" },
    { value: "DOCS", label: "Docs" },
    { value: "VAULT", label: "Vault" },
    { value: "COMPLIANCE", label: "Compliance" },
    { value: "BACKOFFICE_SETTINGS", label: "Backoffice Settings" },
    { value: "BACKOFFICE", label: "Backoffice" },
    { value: "API", label: "API" },
    { value: "CYBERSECURITY", label: "Cybersecurity" },
    { value: "UI", label: "UI" },
    { value: "UX", label: "UX" },
    { value: "DOCUMENT_AUTOMATION", label: "Document Automation" }
  ];

  useEffect(() => {
    if (postData) {
      setAiContent(postData?.requestAIProcessed ?? '');
      setTitle(postData.title ?? "");
      setAssigneeType(postData.assigneeType ?? "");
      setAssigneeId(postData.assigneeId ?? "");
      setOriginalRequest(postData.requestOriginal ?? "");
      setInstructions(postData.requestIntro ?? "");
      setNotes(postData.requestOutro ?? "");
      setTasks(postData.tasks ?? []);
      setCurrentUser(session?.user);
      setReqStatus(postData.status ?? "Request"); 
      const existingProducts = postData.productTags || [];
      const selectedOptions = productDropdownOptions.filter(option => 
        existingProducts.includes(option.value)
      );
      setSelectedProducts(selectedOptions);
    }
  }, [postData, session]);

  useEffect(() => {
    console.log(users);
    if (users.length > 0) {
      setUserList(users);
    }
  }, [users]);

  const handleAssigneeChange = (selectedUserId) => {
    setAssigneeId(selectedUserId);
  };

  const handleStatusChange = (e) => {
    setReqStatus(e.target.value);
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    console.log(tasks);
    const updatedData = {
      title,
      assigneeType,
      status: reqStatus,
      assigneeId: assigneeId,
      assignee: { connect: { id: assigneeId } },
      assignedById: currentUser.id,
      assignedBy: { connect: { id: currentUser.id} },
      requestAIProcessed: aiContent,
      requestOriginal: originalRequest,
      requestIntro: instructions,
      requestOutro: notes,
      completedTasks: postData.completedTasks,
      productTags: selectedProducts.map(option => option.value),
      dueAfterTime: {      
          timeNumber: dueAfterTimeNumber,
          timeUnit: dueAfterTimeUnit,        
      },      
      startedAt: postData.startedAt,
      turnaroundTime: {      
        timeNumber: turnaroundTimeNumber,
        timeUnit: turnaroundTimeUnit,        
      },      
    };

    console.log('updatedData', updatedData);
    try {
      const updatedRequest = await updateRequest(postData.id, updatedData);
      console.log("Updated request:", updatedRequest);
      console.log("rowData:", rowData);

      const updatedRow = await modifyRequest(updatedRequest, tasks);
      const updatedRowData = await rowData.filter(
        (item) => item.id !== updatedRow.id
      );
      updatedRowData.splice(
        rowData.findIndex((item) => item.id === updatedRow.id),
        0,
        updatedRow
      );
      console.log("updatedRowData:", updatedRowData);

      setRowData(updatedRowData);
      setIsVisible(false);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRequest(postData.id);
      setIsVisible(false);
    } catch (err) {
      setError("Failed to delete request. Please try again.");
      console.error(err);
    }
  };

  const configJot = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'paragraph',
      '|',
      'link',
      '|',
      'undo',
      'redo'
    ],
    buttonsXS: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'undo',
      'redo'
    ],
    removeButtons: [
      'source',
      'fullsize',
      'about',
      'outdent',
      'indent',
      'video',
      'print',
      'table',
      'fontsize',
      'superscript',
      'subscript',
      'file',
      'cut',
      'selectall'
    ],
  };
  const EditorPopup = ({ isOpen, setIsOpen, content, setContent, title })  => {
    const [localContent, setLocalContent] = useState(content || '');
  
    useEffect(() => {
      setLocalContent(content || '');
    }, [content, isOpen]);
  
    const handleSave = () => {
      setContent(localContent);
      setIsOpen(false);
    };
  
    const handleCancel = () => {
      setLocalContent(content || '');
      setIsOpen(false);
    };
  
    return(

    

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
                  {title}
                </Dialog.Title>
                <div className="mt-2">

                  <CustomJoditEditor
                    value={localContent}
                    config={configJot}
                    tabIndex={1}
                    setContent={setLocalContent}
                    onChange={(newContent) => setLocalContent(newContent)}
                    onBlur={(newContent) => setLocalContent(newContent)}
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            onClick={handleCancel}
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
  )};

  const TasksEditor = ({ isOpen, setIsOpen, requestId }) => {
    const [localTasks, setLocalTasks] = useState(tasks);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      setLocalTasks(tasks);
    }, [tasks]);
  
    const handleTaskChange = (taskId, field, value) => {
      setLocalTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId
            ? { 
                ...task, 
                [field]: field === "completedAt" 
                  ? (value ? new Date() : null) 
                  : value 
              }
            : task
        )
      );
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
  
    const removeTask = (taskId) => {
      setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };
  
    const saveTasks = async () => {
      setIsSaving(true);
      setError(null);
  
      try {
        const newTasks = localTasks.filter((task) => task.id.startsWith("temp-"));
        const updatedTasks = localTasks.filter((task) => !task.id.startsWith("temp-"));
        const deletedTaskIds = tasks
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
  
        setTasks(localTasks);
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
          className="relative z-[9999999] !bg-[#111c43] rounded-lg"
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
                <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl text-gray-50 !bg-[#111c43] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="flex justify-between text-lg font-medium leading-6 text-gray-50 mb-4"
                  >
                    <div>Edit Tasks</div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={addTask}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Add Task
                      </button>
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
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col flex-wrap gap-6">
                    {localTasks.map((task) => (
                      <Disclosure key={task.id}>
                        {({ open }) => (
                                 <>
                                 <div className="w-full px-4 py-3 flex items-center justify-between text-left">
                                   <div className="flex items-center space-x-3 text-[#111c34] flex-grow">
                                     <input
                                       type="checkbox"
                                       checked={!!task.completedAt}
                                       onChange={(e) => handleTaskChange(task.id, "completedAt", e.target.checked)}
                                       className="w-5 h-5 rounded bg-gray-300 text-blue-600 focus:ring-blue-500"
                                     />
                                     <input
                                       type="text"
                                       value={task.title}
                                       onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                                       placeholder="Task title"
                                       className="flex-grow bg-white rounded-lg text-grey-700 border-none focus:outline-none focus:ring-0"
                                     />
                                   </div>
                                   <div className="flex items-center space-x-2">
                                     <button
                                       onClick={(e) => {
                                         e.preventDefault();
                                         e.stopPropagation();
                                         removeTask(task.id);
                                       }}
                                       className="p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                                     >
                                       <FaTrash className="w-4 h-4" />
                                     </button>
                                     <Disclosure.Button className="focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                       <FaChevronUp
                                         className={`${
                                           open ? 'transform rotate-180' : ''
                                         } w-4 h-4 text-gray-500`}
                                       />
                                     </Disclosure.Button>
                                   </div>
                                 </div>
                                 <Transition
                                   enter="transition duration-100 ease-out"
                                   enterFrom="transform scale-95 opacity-0"
                                   enterTo="transform scale-100 opacity-100"
                                   leave="transition duration-75 ease-out"
                                   leaveFrom="transform scale-100 opacity-100"
                                   leaveTo="transform scale-95 opacity-0"
                                 >
                                   <Disclosure.Panel className="px-4 pb-3 ml-5 mr-5">
                                     <textarea
                                       value={task.taskText}
                                       onChange={(e) => handleTaskChange(task.id, 'taskText', e.target.value)}
                                       placeholder="Task details"
                                       className="w-full mt-1 ml-3  px-3 py-2 text-[#111c34] border rounded-lg focus:outline-none focus:border-blue-500"
                                       rows="3"
                                     />
                                   </Disclosure.Panel>
                                 </Transition>
                               </>
                        )}
                      </Disclosure>
                    ))}
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

  const handleClose = (user, setIsVisible, data) => {
    console.log(data, user);
    if (data.status == 'Request' && user.role == 'PM')
      setStatus(data.id, 'Viewed', user);
    setIsVisible(false);
} 

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
        <div className="fixed top-0 right-0 h-full w-full sm:w-[600px] !bg-[#111c43] shadow-lg z-[999999] overflow-y-auto">
          <div className="m-2 p-6 !bg-[#111c43] rounded-lg ">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl text-gray-50 font-bold">Edit Request</h2>
              <button
                onClick={() => handleClose(session.user,setIsVisible, postData)}
                className="text-gray-50 hover:text-gray-100 transition-colors"
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
                <label className="block text-sm font-medium text-gray-50 mb-1">
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
                <label className="block text-sm font-medium text-gray-50 mb-1">
                Products • Initiatives
               </label>
               <div className="relative">
               <Select 
               classNamePrefix='Select2' 
               className="ti-form-select rounded-sm !p-0" 
               isMulti 
               options={productDropdownOptions}
               value={selectedProducts}
               onChange={handleProductChange}
               />
               </div></div>

              <div className="flex gap-2 ">
                <div>
                <label className="block text-sm font-medium text-gray-50 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={reqStatus}
                    onChange={handleStatusChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {["Request", "Viewed", "Assigned", "PastDue", "Merged", "Completed"].map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-1">
                  Assignee Type
                </label>
                <input
                  type="text"
                  value={assigneeType}
                  onChange={(e) => setAssigneeType(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-50 mb-1">
                  Assignee
                </label>
                <UserDropdown
                  users={userList}
                  selectedUserId={assigneeId}
                  setAssigneeId={setAssigneeId}
                  onUserSelect={handleUserSelect}
                />
              </div>

              <div className="flex gap-8"> 
                <div>
                  <label className="block text-sm font-medium text-gray-50 mb-1">
                    Due After
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={dueAfterTimeNumber}
                      onChange={(e) => setDueAfterTimeNumber(parseInt(e.target.value))}
                      className="w-1/4 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                    <select
                      value={dueAfterTimeUnit}
                      onChange={(e) => setDueAfterTimeUnit(e.target.value)}
                      className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="HOUR">Hour</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                    </select>
                  </div>
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-50 mb-1">
                    Turnaround
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={turnaroundTimeNumber}
                      onChange={(e) => setTurnaroundTimeNumber(parseInt(e.target.value))}
                      className="w-1/4 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                    <select
                      value={turnaroundTimeUnit}
                      onChange={(e) => setTurnaroundTimeUnit(e.target.value)}
                      className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="HOUR">Hour</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-50 mb-1">
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
                  className="ti-btn ti-btn-warning-full label-ti-btn !rounded-full"
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

                <button
                  onClick={() => setIsAIEditorOpen(true)}
                  type="button"
                  className="ti-btn ti-btn-primary-full label-ti-btn !rounded-full"
                >
                  <i className="ri-edit-line label-ti-btn-icon me-2 !rounded-full"></i>
                  AI Request
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-end"></div>
            <div className="flex justify-right items-center mt-6 ">
              <button
                onClick={handleSave}
                disabled={isSaving}
                type="button"
                className={`mt-6 w-1/3 py-2 justify-center text-center ti-btn ti-btn-primary-full label-ti-btn !rounded-full ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <i className="ri-loader-2-fill text-[1rem] animate-spin"></i>
                ) : (
                  <i className="ri-save-line label-ti-btn-icon me-2 !rounded-full"></i>
                )}
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

<EditorPopup
        isOpen={isAIEditorOpen}
        setIsOpen={setIsAIEditorOpen}
        content={aiContent}
        setContent={setAiContent}
        title="Edit AI Content"
      />

<TasksEditor
        isOpen={isTasksEditorOpen}
        setIsOpen={setIsTasksEditorOpen}
        requestId={postData.id}
      />
    </>
  );
};

export default RequestEditSidebar;