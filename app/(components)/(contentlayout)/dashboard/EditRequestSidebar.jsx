"use client";

import React, { Fragment, useState, useEffect, useRef, useCallback } from "react";

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
import TaskListWithCheckboxes from "./TasksListWithCheckboxes";


const Select = dynamic(() => import("react-select"), { ssr: false });

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

function calculateTaskCompletionPercentage(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(task => task.completedAt !== null);
  const percentComplete = Math.round((completedTasks.length / tasks.length) * 100);

  return Math.min(100, Math.max(0, percentComplete));
}

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
    const percentComplete = calculateTaskCompletionPercentage(tasks);

    return {
      ...request,
      percentComplete,
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
  const [htmlTasks, setHtmlTasks] = useState('');

  function tasksToHtml(tasks) {
    const taskItems = tasks.map(task => `
    <li id="${task.id}">
      <input type="checkbox" id="checkbox-${task.id}" ${task.completedAt ? 'checked' : ''}>
      <label for="checkbox-${task.id}">
        <p><strong>${task.title}</strong></p>
      </label>
      <ul>
        ${task.taskText.split('\n').map(line => `<li>${line}</li>`).join('')}
      </ul>
    </li>
  `).join('');

    return `<ol>${taskItems}</ol>`;
  }


  function htmlToTasks(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const listItems = doc.querySelectorAll('ol > li');

    return Array.from(listItems).map(li => {
      const id = li.id;
      const checkbox = li.querySelector('input[type="checkbox"]');
      const title = li.querySelector('label p strong').textContent;
      const taskTextItems = li.querySelectorAll('ul > li');
      const taskText = Array.from(taskTextItems).map(item => item.textContent).join('\n');

      return {
        id: id,
        title: title,
        taskText: taskText,
        completedAt: checkbox.checked ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(), // Note: We can't recover the original createdAt
        updatedAt: new Date().toISOString(), // Note: We set this to the current time
        requestId: 'generated-' + Math.random().toString(36).substr(2, 9) // Generating a random requestId
      };
    });
  }


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
      const htmlTasks = tasksToHtml(postData.tasks);
      setHtmlTasks(htmlTasks);
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

  const editorRef = useRef(null);


  const handleAssigneeChange = (selectedUserId) => {
    setAssigneeId(selectedUserId);
  };

  const handleStatusChange = (e) => {
    setReqStatus(e.target.value);
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleHtmlTasksChange = (newContent) => {
    // const tasks = htmlToTasks(newContent);
    // console.log('handleHtmlTasksChange',tasks);
    console.log('handleHtmlTasksChange',newContent);
    // setTasks(tasks);
    // setHtmlTasks(newContent);
  };

  const handleBlur = useCallback(() => {
    if (editorRef.current) {
      const editorContent = editorRef.current.value;
      setContent(editorContent);
      console.log('Editor content on blur:', editorContent);
    }
  }, []);

  const handleEditorInit = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const calculateStatus = async (currentUser,reqStatus, percentComplete) => {
    if (percentComplete >= 100) {
      return 'Completed';
    }

    if (currentUser) {
      if (reqStatus === 'Request') {
       if (currentUser.role === 'PM') {

         if (assigneeId)  {
           return 'Assigned';
         } else {
           return 'Viewed';
         }

        } else {
          return 'Request';
        }


      }
      else if (reqStatus === 'Viewed') {

        if (currentUser.role === 'PM') {
          if (assigneeId)  {
            return 'Assigned';
          } else {
            return 'Viewed';
          }
        }

      }


    }

    return reqStatus;
    };


  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    console.log(tasks);
    console.log('Content on submit:', editorRef);
    let  finalInstructions = instructions;
    if (editorRef.current) {
       finalInstructions = editorRef.current.value;
      console.log('Final content on submit:', finalContent);
    }

    const percentComplete = await calculateTaskCompletionPercentage(tasks);
    const maybeUpdateStatus = await calculateStatus(currentUser,reqStatus, percentComplete);
    const updatedData = {
      title,
      assigneeType,
      status: maybeUpdateStatus,
      assigneeId: assigneeId,
      assignee: { connect: { id: assigneeId } },
      assignedById: currentUser.id,
      assignedBy: { connect: { id: currentUser.id} },
      requestAIProcessed: aiContent,
      requestOriginal: originalRequest,
      requestIntro: finalInstructions || instructions,
      requestOutro: notes,
      completedTasks: postData.completedTasks,
      tasks: tasks,
      percentComplete: percentComplete,
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
              <Dialog.Panel
                  className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">

                  {/*<CustomJoditEditor*/}
                  {/*    value={localContent}*/}
                  {/*    tabIndex={1}*/}
                  {/*    onChange={handleEditorChange}*/}
                  {/*    onBlur={handleEditorBlur}*/}
                  {/*    handleEditorInit={handleEditorInit}*/}
                  {/*    editorRef={editorRef}*/}
                  {/*/>*/}
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
    )
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
          <div
              className="fixed top-0 right-0 h-full w-full sm:w-3/5 xs:w-full!bg-[#111c43] shadow-lg z-[999999] overflow-y-auto">
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
                  <div className="w-1/3">
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
                    Summary
                  </label>
                  <CustomJoditEditor
                      ref={editorRef}
                      value={instructions}
                      tabIndex={1}
                      onBlur={newContent => setInstructions(newContent)}
                      handleEditorInit={handleEditorInit}
                  />
                  <label className="block text-sm font-medium text-gray-50 mb-1">
                    Instructions
                  </label>

                  <TaskListWithCheckboxes tasks={tasks} setTasks={setTasks} />
                </div>
                <div className="flex flex-row space-x-4 justify-around mt-24">

                  <button
                      onClick={handleSave}
                      disabled={isSaving}
                      type="button"
                      className={`mt-6 w-1/3 py-2 justify-center text-center ti-btn ti-btn-primary-full label-ti-btn !rounded-full ${
                          isSaving ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSaving ? (
                        <i className="ri-save-line text-[1rem] animate-spin me-2 !rounded-full"></i>
                    ) : (
                        <i className="ri-save-line label-ti-btn-icon me-2 !rounded-full"></i>
                    )}
                    {isSaving ? "Saving..." : "Update"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </Transition>

    </>
  );
};

export default RequestEditSidebar;