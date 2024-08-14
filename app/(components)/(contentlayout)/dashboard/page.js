import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment } from "react";
import RequestsTable from "./RequestsTable";


const Projects = () => {
	return (
		<Fragment>
			<Seo title={"Xco3 - Requests"} />
			<Pageheader currentpage="Requests" activepage="Dashboard" mainpage="Projects" />
				<div className="box-body space-y-3">
					<div className="overflow-hidden">
						<div id="reactivity-table" className="ti-custom-table ti-striped-table ti-custom-table-hover">							
						<RequestsTable />
						</div>
					</div>
				</div>
		</Fragment>
	);

}




export default Projects;
