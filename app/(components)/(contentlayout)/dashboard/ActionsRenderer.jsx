import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSessionContext } from "@/app/(components)/(contentlayout)/layout";


export default (props) => {
  //    detruct props
  const { data, value, handleShowOverlay, deleteRequest } = props;
  const { session, status } = useSessionContext();

	if (status === "loading" || status === "unauthenticated") {
		return <div>Loading...</div>;
	  }
	
  return (
    <div className="flex justify-center items-center gap-2 py-2">
      <button
        onClick={() => handleShowOverlay(data, session?.user)}
        type="button"
        aria-label="button"
        className="ti-btn ti-btn-icon bg-primary/20 text-primary !border hover:bg-primary hover:text-white !rounded-full ti-btn-wave edit-button-b"
      >
        <FaEdit 
        className="edit-button-i"
        style={{'color':'#845adf','--hover-color':'white'}}

         />
      </button>

      <button
        onClick={() => deleteRequest(data.id)}
        type="button"
        aria-label="button"
        className="ti-btn ti-btn-icon bg-secondary/20 text-primary !border hover:bg-secondary hover:text-white !rounded-full ti-btn-wave delete-button-b"
      >
        <FaTrashAlt 
        className="delete-button-i"
        style={{'color':'#49b6f5','--hover-color':'white'}}

         />
      </button>

    </div>
  );
};
