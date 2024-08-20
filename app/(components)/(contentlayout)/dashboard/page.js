"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useState, useEffect } from "react";
import RequestsTable from "./RequestsTable";
import NewRequestPopup from "./NewRequest";
import calculateFutureDate from "./calculateFutureDate"; 
import calculateWorkHoursPassed from "./calculateWorkHoursPassed";
import RequestEditSidebar from "./EditRequestSidebar";
import {fetchRequests, fetchUsers} from "@/shared/actions";

import { useSession } from "next-auth/react";

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
  

const Projects = () => {
const { data: session } = useSession();

const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isNewReqPopupOpen, setIsNewReqPopupOpen] = useState(false);
  const [postData, setPostData] = useState(null);
  const [users, setUsers] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openNewReqPopup = () => {
    setIsNewReqPopupOpen(true);
  };

  const closeNewReqPopup = () => {
    setIsNewReqPopupOpen(false);
  };

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
    <Fragment>
      <Seo title={"Xco3 - Requests"} />
      <Pageheader
        currentpage="Requests"
        activepage="Dashboard"
        mainpage="Projects"
      />
	  <div className="flex justify-center">      
		<div className="header-element p-2.5 md:px-[0.325rem]">
        <button
          onClick={() => openNewReqPopup()}
          type="button"
          class="ti-btn !bg-[#111c43] ti-btn-[#111c43] !text-white ti-btn-wave"
        >
          New Request
        </button>
      </div>
	  </div>


      <div className="box-body space-y-3">
        <div className="overflow-hidden">
          <div
            id="reactivity-table"
            className="ti-custom-table ti-striped-table ti-custom-table-hover"
          >
            {session && (
              <NewRequestPopup
                session={session}
                setIsOpen={setIsNewReqPopupOpen}
                isOpen={isNewReqPopupOpen}
                onClose={closeNewReqPopup}
				setRowData={setRowData}
				rowData={rowData}
				users={users}
              />
            )}
		<RequestEditSidebar
        isVisible={isOverlayVisible}
        setIsVisible={setOverlayVisible}
        postData={postData}
        setRowData={setRowData}
        rowData={rowData}
        users={users}
      />
            <RequestsTable
              isOverlayVisible={isOverlayVisible}
              setOverlayVisible={setOverlayVisible}
              postData={postData}
              rowData={rowData}
			setNewRequestPopupShow={setIsNewReqPopupOpen}
			newRequestPopupShow={isNewReqPopupOpen}
			setPostData={setPostData}
              setRowData={setRowData}
			/>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Projects;
