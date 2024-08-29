"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {createAiAssignee, createAiTitle, saveRequest as saveRequestAction} from "@/shared/actions";

import UserDropdown from "@/shared/components/UserDropdown";
import { marked } from 'marked';

import calculateFutureDate from "@/app/(components)/(contentlayout)/dashboard/calculateFutureDate";
import calculateWorkHoursPassed from "@/app/(components)/(contentlayout)/dashboard/calculateWorkHoursPassed";
import { processTextToRequest, createAiTasksAction, createAiInstructions, createAiNotes } from "@/shared/actions";
import CustomJoditEditor from "./CustomJoditEditor";

const Select = dynamic(() => import("react-select"), { ssr: false });

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
  { value: "DOCUMENT_AUTOMATION", label: "Document Automation" },
];



const NewRequestPopup = ({
                           isOpen,
                           onClose,
                           setIsOpen,
                           session,
                           setRowData,
                           rowData,
                           users,
                         }) => {
  const [title, setTitle] = useState("");
  const [assigneeType, setAssigneeType] = useState("");
  const [status, setStatus] = useState("Request");
  const [assigneeId, setAssigneeId] = useState("");
  const [userId, setUserId] = useState(session?.user.id);
  const [originalRequest, setOriginalRequest] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dueAfterTimeNumber, setDueAfterTimeNumber] = useState(1);
  const [dueAfterTimeUnit, setDueAfterTimeUnit] = useState("DAY");
  const [turnaroundTimeNumber, setTurnaroundTimeNumber] = useState(1);
  const [turnaroundTimeUnit, setTurnaroundTimeUnit] = useState("DAY");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [requestAIProcessed, setRequestAIProcessed] = useState('');
  const editorRef = useRef(null);



  const [currentUser, setCurrentUser] = useState(session?.user);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleUserSelect = (userId) => {
    setAssigneeId(userId);
  };

  const handleEditorInit = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const getAiRequestBody = async () => {
    setIsGeneratingAI(true);
    try {

      const response = await processTextToRequest(originalRequest);

      if (response.error) {
        console.error('Error generating AI text:', response.error);
        // Optionally, you can set an error state here to display to the user
      } else {
        const htmlContent = marked(response.response || '');
        setRequestAIProcessed(htmlContent);
        const titleFromAi = await createAiTitle(htmlContent || "")
        const assigneeFromAi = await createAiAssignee(htmlContent || "")
        // console.log("Title From AI:", titleFromAi);
        setTitle(titleFromAi || 'No Title');
        setAssigneeType(assigneeFromAi || 'TBD');

      }
    } catch (error) {
      console.error('Error in getAiRequestBody:', error);
      // Optionally, you can set an error state here to display to the user
    } finally {
      setIsGeneratingAI(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
    }
    // console.log(currentUser);
  }, [currentUser, session]);

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

  const handleSaveRequest = async () => {

    setIsSaving(true);
    setError(null);
    const instructionsFromAi = await createAiInstructions(requestAIProcessed || '');
    // const notesFromAi = await createAiNotes(requestAIProcessed || "");
    let  requestAISaved = requestAIProcessed;
    if (editorRef.current) {
      requestAISaved = editorRef.current.value;
      console.log('Final content on submit:', requestAISaved);
    }    const updatedData = {

      title: title || titleFromAi,
      assigneeType: assigneeType,
      status: status,
      assigneeId: assigneeId || currentUser.id,
      requestOriginal: originalRequest,
      requestIntro: instructions || instructionsFromAi,
      requestOutro: notes,
      requestAIProcessed: requestAIProcessed || requestAISaved,
      startedAt: DateTime.now().setZone("America/Chicago"),
      createdById: userId || currentUser.id,
      assignedById: userId || currentUser.id,
      productTags: selectedProducts.map((option) => option.value),
      dueAfterTime: {
        timeNumber: dueAfterTimeNumber,
        timeUnit: dueAfterTimeUnit,
      },
      turnaroundTime: {
        timeNumber: turnaroundTimeNumber,
        timeUnit: turnaroundTimeUnit,
      },
    };

    try {
      const updatedRequest = await saveRequestAction(updatedData);
      const createdTasksFromAI = await createAiTasksAction(updatedRequest.requestAIProcessed || '', updatedRequest.id) && updatedRequest.requestAIProcessed != '' ;
      const updatedRow = await modifyRequest(updatedRequest);
      setRowData([...rowData, updatedRow]);
      // setRowData(updatedRowData);
      console.log("Request saved successfully", updatedRequest);
      setError(null);
      onClose();
    } catch (error) {
      console.error("Error saving request:", error);
      setError("Error saving request. Please try again.", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            className="relative z-[999999999999] !bg-[#111c43] "
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
                <Dialog.Panel className="w-full transform overflow-hidden !bg-[#111c43] rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all sm:w-4/5 sm:h-4/5 max-w-6xl">
                  <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveRequest();
                      }}
                  >
                    <div className="flex gap-4">
                      <div className="w-3/6">
                        <label className="block text-sm font-medium text-gray-50 mb-1">
                          Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !text-[#111c43]"
                        />
                      </div>
                      <div className="w-2/6">
                        <label className="block text-sm font-medium text-gray-50 mb-1">
                          Products • Initiatives
                        </label>
                        <div className="relative">
                          <Select
                              classNamePrefix="Select2"
                              className="ti-form-select rounded-sm !p-0 !text-[#111c43]"
                              isMulti
                              options={productDropdownOptions}
                              onChange={handleProductChange}
                          />
                        </div>
                      </div>
                      <div className="w-1/6">
                        <label className="block text-sm font-medium text-gray-50 mb-1">
                          Status
                        </label>
                        <div className="relative">
                          <select
                              value={status}
                              onChange={handleStatusChange}
                              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none !text-[#111c43]"
                          >
                            {["Request", "Viewed", "Assigned", "PastDue", "Merged", "Completed"].map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {statusOption}
                                </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>


                    <div className="flex gap-2 ">

                      <div className="w-1/5">
                        <label className="block text-sm font-medium text-gray-50 mb-1">
                          Assignee
                        </label>
                        <UserDropdown
                            users={users}
                            selectedUserId={assigneeId}
                            setAssigneeId={setAssigneeId}
                            onUserSelect={handleUserSelect}
                            className="!text-[#111c43]"
                        />
                      </div>
                      <div className="w-3/5">
                        <label className="block text-sm font-medium text-gray-50 mb-1">
                          Assignee Type
                        </label>
                        <input
                            type="text"
                            value={assigneeType}
                            onChange={(e) => setAssigneeType(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !text-[#111c43]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-row space-x-2 justify-start gap-2 mx-2">
                      <div className="w-1/6 relative">
                        <label className="absolute bottom-0 left-0 text-sm font-medium text-gray-50">
                          Request Prompt
                        </label>
                      </div>
                      <div className="flex justify-center w-4/6">
                        <div>
                          <button
                              onClick={getAiRequestBody}
                              type="button"
                              disabled={isGeneratingAI}
                              className={`ti-btn ti-btn-info-full label-ti-btn !rounded-full text-[#111c43] ${
                                  isGeneratingAI ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            <i className="ri-ai-generate text-[#111c43] label-ti-btn-icon me-2 !rounded-full"></i>
                            <span className="!text-[#111c43]">
                      {isGeneratingAI ? 'Generating...' : 'Generate Tasks and Instructions'}
                    </span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <textarea
                        value={originalRequest}
                        onChange={(e) => setOriginalRequest(e.target.value)}
                        placeholder="Notes"
                        className="w-full p-2 border rounded-lg !text-[#111c43]"
                    />

                    {/*<CustomJoditEditor*/}
                    {/*    value={requestAIProcessed}*/}
                    {/*    onChange={(content) => setRequestAIProcessed(content)}*/}
                    {/*    setContent={setRequestAIProcessed}*/}
                    {/*    className="w-full"*/}
                    {/*/>*/}

                    <CustomJoditEditor
                        ref={editorRef}
                        value={requestAIProcessed}
                        tabIndex={1}
                        onBlur={newContent => setRequestAIProcessed(newContent)}
                        handleEditorInit={handleEditorInit}
                        className="w-full"
                    />



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
                              className="w-1/4 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !text-[#111c43]"
                              min="0"
                          />
                          <select
                              value={turnaroundTimeUnit}
                              onChange={(e) => setTurnaroundTimeUnit(e.target.value)}
                              className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !text-[#111c43]"
                          >
                            <option value="HOUR">Hour</option>
                            <option value="DAY">Day</option>
                            <option value="WEEK">Week</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-8">
                      <button
                          disabled={isSaving}
                          type="submit"
                          className={`mt-6 w-1/5 py-2 justify-center text-center ti-btn ti-btn-primary-full label-ti-btn !rounded-full ${
                              isSaving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        {isSaving ? (
                            <i className="ri-loader-2-fill text-[1rem] animate-spin"></i>
                        ) : (
                            <i className="ri-save-line label-ti-btn-icon me-2 !rounded-full"></i>
                        )}
                        {isSaving ? "Saving..." : "Save Request"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  );
};

export default NewRequestPopup;
