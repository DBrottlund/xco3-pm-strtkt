"use client"; // Mark this as a client component

import React, { useState, useEffect } from 'react';
import { fetchRequests } from '@/shared/actions';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'rizzui'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import ButtonRenderer from './ButtonRenderer.jsx';
import BadgeRenderer from './BadgeRenderer.jsx';
import StatusBadgeRenderer from './StatusBadgeRenderer.jsx';
import DueDateRenderer from './DueDateRenderer.jsx';
import ProductBadgeRenderer from './ProductBadgeRenderer.jsx';
import calculateFutureDate from "./calculateFutureDate.js"; 
import calculateWorkHoursPassed from "./calculateWorkHoursPassed.js";
import ProgressRenderer from './ProgressRenderer.jsx';
import ActionsRenderer from './ActionsRenderer.jsx';
import RequestEditSidebar from './EditRequestSidebar.jsx';

// Function to modify a single request
const modifyRequest = async (request) => {



  try {
    // Log the inputs to calculateFutureDate
    console.log("request.deadline:", request.dueAfterTime);
    console.log("request.startedAt:", request.startedAt);

    const deadline = await calculateFutureDate(request.dueAfterTime, request.startedAt);
    const deadlinePercent = await calculateWorkHoursPassed(
      request.startedAt,
      deadline
    );

    // Concatenate productTags and initiativeTags into allTags
    const allTags = [...(request.productTags || []), ...(request.initiativesTags || [])];

    return {
      ...request,
      deadline: deadline,
      deadlinePercent: deadlinePercent,
      assignee: request.assignee,
      tasks: request.tasks,
      status: request.status,
      actions: request.actions,
      allTags: allTags, // Add the concatenated tags
    };

  } catch (error) {
    console.error("Error in modifyRequest:", error); // Catch any errors in modification
    return request; // Return the original request in case of an error
  }
};



const RequestsTable = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [postData, setPostData] = useState(null);

  const handleShowOverlay = (req) => {
    console.log("handleShowOverlay called with request:", req);
    setPostData(req); // Set post data to populate form
    setOverlayVisible(true);
  };
  const [rowData, setRowData] = useState(null);

  const [colDefs, setColDefs] = useState([
    {
      field: "allTags",
      filter: true,
      headerName: "Products • Initiatives",
      cellRenderer: (p) => <ProductBadgeRenderer data={p.data} value={p.value} />,
      width: 220,  // Set the width for the "Products" column
    },
    {
      field: "title",
      filter: true,
      headerName: "Title",     
      width: 270,  // Set the width for the "Title" column
    },
    {
      field: "assignee",
      headerName: "Assignee",
      filter: true,
      cellRenderer: (p) => p.value.firstName + " " + p.value.lastName,
      width: 150,  // Set the width for the "Assignee" column
    },
    {
      field: "assignedBy",
      headerName: "Assigned By",
      filter: true,
      cellRenderer: (p) => p.value.firstName + " " + p.value.lastName,
      width: 150,  // Set the width for the "Assigned By" column
    },
    {
      field: "deadline",
      headerName: "Deadline",
      filter: true,
      width: 220,  // Set the width for the "Deadline" column
    },
    {
      field: "deadlinePercent",
      filter: true,
      headerName: "Progress",
      cellRenderer: (p) => <ProgressRenderer data={p.data} value={p.value}/>,
   
      width: 120,  // Set the width for the "Task / Time" column
    },
    {
      field: "status",
      filter: true,
      headerName: "Status",
      cellRenderer: (p) => <StatusBadgeRenderer data={p.data} text={p.value} value={p.value}/>,
      width: 120,  // Set the width for the "Status" column
    },
    {
      field: "id",
      headerName: "Actions",
      cellRenderer: (p) => <ActionsRenderer isOverlayVisible={isOverlayVisible} handleShowOverlay={handleShowOverlay} data={p.data} value={p.value}/>,
      width: 100,  // Set the width for the "Actions" column
    },
  ]);
  

  useEffect(() => {
    async function getRequests() {
      const requests = await fetchRequests(); // Call the server action

      // Modify the requests data
      const modifiedRequests = await Promise.all(
        requests.map(async (request) => await modifyRequest(request))
      );

      setRowData(modifiedRequests);
    }

    getRequests();
  }, []);

  if (!rowData) {
    return <p>Loading...</p>;
  }

  return (
    <>  
    <div
     className="ag-theme-quartz" // applying the Data Grid theme
     style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact
  getRowHeight={(params) => {
    // You can return a specific height based on the row's data or other conditions
   
    return (params.data.allTags.length / 2) * 36;  // Default row height
  }}
  columnDefs={colDefs}
  rowData={rowData}
/>

    </div>
    
    <div>
    <RequestEditSidebar
        isVisible={isOverlayVisible}
        setIsVisible={setOverlayVisible}
        postData={postData} // Pass post data to the overlay
      />
      <pre>{JSON.stringify(rowData, null, 2)}</pre>
    </div>
    </>
   );
};

export default RequestsTable;
