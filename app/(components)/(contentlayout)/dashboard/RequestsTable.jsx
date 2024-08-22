import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchRequests, fetchUsers, createLog } from "@/shared/actions";
import ProductBadgeRenderer from "./ProductBadgeRenderer";
import ProgressRenderer from "./ProgressRenderer";
import StatusBadgeRenderer from "./StatusBadgeRenderer";
import ActionsRenderer from "./ActionsRenderer";
import TeamRenderer from "./TeamRenderer";
import RequestEditSidebar from "./EditRequestSidebar";
import calculateFutureDate from "./calculateFutureDate";
import calculateWorkHoursPassed from "./calculateWorkHoursPassed";
import { deleteRequest } from "@/shared/actions";
// import  modifyRequest  from "./modifyRequest";

// const modifyRequest = async (request) => {
//   try {
//     const deadline = await calculateFutureDate(request.dueAfterTime, request.startedAt);
//     const deadlinePercent = await calculateWorkHoursPassed(request.startedAt, deadline);
//     const allTags = [...(request.productTags || []), ...(request.initiativesTags || [])];

//     return {
//       ...request,
//       deadline,
//       deadlinePercent,
//       allTags,
//     };
//   } catch (error) {
//     console.error("Error in modifyRequest:", error);
//     return request;
//   }
// };

const RequestsTable = ({
  setNewRequestPopupShow,
  newRequestPopupShow,
  postData,
  rowData,
  setPostData,
  setRowData,
  isOverlayVisible,
  setOverlayVisible,
}) => {
  // const [postData, setPostData] = useState(null);
  // const [users, setUsers] = useState([]);
  // const [rowData, setRowData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleShowOverlay = (req, user) => {
    console.log("handleShowOverlay called with request:", req);
    setPostData(req);
    createLog(
      req.id,
      "VIEWED",
      `Request viewed by ${user.firstName} ${user.lastName} (${user.email})`
    );

    setOverlayVisible(true);
  };

  const initiateDelete = (id) => {
    console.log("initiateDelete called with id:", id);
    setConfirmDelete(id);
  };

  const confirmDeleteRow = () => {
    if (confirmDelete !== null) {
      const updatedRowData = rowData.filter((row) => row.id !== confirmDelete);
      setRowData(updatedRowData);
      try {
        deleteRequest(confirmDelete);
      } catch (error) {
        console.error("Error deleting request:", error);
      }
      setConfirmDelete(null);
      console.log("Row deleted successfully");
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
    console.log("Row deletion cancelled");
  };

  const colDefs = [
    {
      field: "allTags",
      filter: true,
      headerName: "Products • Initiatives",
      cellRenderer: ProductBadgeRenderer,
      width: 220,
    },
    { field: "title", filter: true, headerName: "Title", width: 270 },
    {
      field: "assigneeHistory",
      headerName: "Team",
      filter: true,
      cellRenderer: TeamRenderer,
      // cellRenderer: (p) => (
      //   <>
      //   <div class="md:block hidden dropdown-profile"><p class="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] "> {`${p.data.assignee.firstName} ${p.data?.assignee.lastName}`}</p><span class="opacity-[0.7] font-normal text-[#536485] block text-[0.6875rem] ">{`${p.data?.assigneeType}`}</span></div>
      //   <div className="flex flex-col justify-start">
      //     <div className="">

      //     </div>
      //     <div className="text-gray-500">{`${p.data.assigneeType}`}</div>
      //   </div></>

      //   ),
      // valueGetter: (params) => `${params.data.assignee.firstName} ${params.data.assignee.lastName}`,
      width: 150,
    },
    {
      field: "assignedBy",
      headerName: "Assigned By",
      filter: true,
      // valueGetter: (params) => `${params.data.assignedBy.firstName} ${params.data.assignedBy.lastName}`,
      cellRenderer: TeamRenderer,
      width: 150,
    },
    { field: "deadline", headerName: "Deadline", filter: true, width: 220 },
    {
      field: "deadlinePercent",
      filter: true,
      headerName: "Progress",
      cellRenderer: ProgressRenderer,
      width: 120,
    },
    {
      field: "status",
      filter: true,
      headerName: "Status",
      cellRenderer: StatusBadgeRenderer,
      width: 120,
    },
    {
      field: "id",
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionsRenderer
          isOverlayVisible={isOverlayVisible}
          handleShowOverlay={handleShowOverlay}
          deleteRequest={initiateDelete}
          data={params.data}
          value={params.value}
        />
      ),
      width: 100,
    },
  ];

  return (
    <>
      {rowData && (
        <div className="ag-theme-quartz" style={{ height: '80vh' }}>
          <AgGridReact
            domLayout={"autoHeight"}
            getRowHeight={(params) => {
              const h = (params.data.allTags?.length / 2) * 36;
              return h > 72 ? h : 72; // Default row height
            }}
            columnDefs={colDefs}
            rowData={rowData}
          />
        </div>
      )}

      {confirmDelete !== null && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Popup */}
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-20 bg-white p-6 rounded-lg shadow-xl z-50">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete this row?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeleteRow}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes, delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {/* <RequestEditSidebar
        isVisible={isOverlayVisible}
        setIsVisible={setOverlayVisible}
        postData={postData}
        setRowData={setRowData}
        rowData={rowData}
        users={users}
      /> */}
    </>
  );
};

export default RequestsTable;
