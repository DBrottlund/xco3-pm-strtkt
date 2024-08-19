import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import { fetchRequests, fetchUsers } from '@/shared/actions';
import ProductBadgeRenderer from './ProductBadgeRenderer';
import ProgressRenderer from './ProgressRenderer';
import StatusBadgeRenderer from './StatusBadgeRenderer';
import ActionsRenderer from './ActionsRenderer';
import RequestEditSidebar from './EditRequestSidebar';
import calculateFutureDate from "./calculateFutureDate"; 
import calculateWorkHoursPassed from "./calculateWorkHoursPassed";
// import  modifyRequest  from "./modifyRequest";

const modifyRequest = async (request) => {
  try {
    const deadline = await calculateFutureDate(request.dueAfterTime, request.startedAt);
    const deadlinePercent = await calculateWorkHoursPassed(request.startedAt, deadline);
    const allTags = [...(request.productTags || []), ...(request.initiativesTags || [])];

    return {
      ...request,
      deadline,
      deadlinePercent,
      allTags,
    };
  } catch (error) {
    console.error("Error in modifyRequest:", error);
    return request;
  }
};

const RequestsTable = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [postData, setPostData] = useState(null);
  const [users, setUsers] = useState([]);
  const [rowData, setRowData] = useState([]);

  const handleShowOverlay = (req) => {
    console.log("handleShowOverlay called with request:", req);
    setPostData(req);
    setOverlayVisible(true);
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
      field: "assignee",
      headerName: "Assignee",
      filter: true,
      valueGetter: (params) => `${params.data.assignee.firstName} ${params.data.assignee.lastName}`,
      width: 150,
    },
    {
      field: "assignedBy",
      headerName: "Assigned By",
      filter: true,
      valueGetter: (params) => `${params.data.assignedBy.firstName} ${params.data.assignedBy.lastName}`,
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
          data={params.data}
          value={params.value}
        />
      ),
      width: 100,
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [requests, fetchedUsers] = await Promise.all([fetchRequests(), fetchUsers()]);
        const modifiedRequests = await Promise.all(requests.map(modifyRequest));
        setRowData(modifiedRequests);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
getRowHeight={(params) => { 
const h = (params.data.allTags?.length / 2) * 36;
  return h > 72 ? h : 72;  // Default row height
}}          columnDefs={colDefs}
          rowData={rowData}
        />
      </div>
      
      <RequestEditSidebar
        isVisible={isOverlayVisible}
        setIsVisible={setOverlayVisible}
        postData={postData}
        setRowData={setRowData}
        rowData={rowData}
        users={users}
      />
    </>
  );
};

export default RequestsTable;