"use client";
import { auth } from "@/api/auth";

// import {WhoAmIServerAction} from "@/shared/whoami/WhoAmIServerAction";
// import {WhoAmIAPI} from "@/shared/whoami/WhoAmIAPI";
// import {WhoAmIRSC} from "@/shared/whoami/WhoAmIRSC";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import PercentRing from "@/shared/components/percentRing";
import * as Projectdata from "@/shared/data/dashboards/projectsdata";
import { requestSummaryData } from "@/shared/data/dashboards/requeststabledata";
import dynamic from "next/dynamic";
import { ActionIcon, Badge, Checkbox, Text, Tooltip, Button } from 'rizzui';
import { FaExclamationCircle, FaCheckCircle, FaSyncAlt, FaExclamationTriangle, FaCodeBranch, FaCheck, FaLightbulb, FaEye, FaClipboard } from 'react-icons/fa';
import StatusBadge from './StatusBadge'; // Adjust the import path accordingly



import moment from 'moment-timezone';
import { add, subtract } from 'date-arithmetic';


import { formatDistanceToNow, parseISO, formatISO } from 'date-fns';
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	usePagination,
} from "react-table";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Projects = () => {
	return (
		<Fragment>
			<Seo title={"Xco3 Requests"} />
			<Pageheader currentpage="Requests" activepage="Dashboard" mainpage="Projects" />
			
					{/* <div className="grid grid-cols-12 gap-x-6">
					<div className="xxl:col-span-4 col-span-12">
							<div className="grid grid-cols-12 gap-x-6">								
							<div className="xl:col-span-12 col-span-12">
								<div className="box">
										<div className="box-header justify-between">
											<div className="box-title">
                                                % Requests completed
											</div>
											<div className="hs-dropdown ti-dropdown">
												<Link href="#!" scroll={false} className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
													aria-expanded="false">
                                                    View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
												</Link>
												<ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Today</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>This Week</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Last Week</Link></li>
												</ul>
											</div>
										</div>
										<div className="box-body">
											<div id="projectAnalysis">
												<ReactApexChart options={Projectdata.ProjectAnalysis.options} series={Projectdata.ProjectAnalysis.series} type="line" width={"100%"} height={315} />
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>						
						<div className="xxl:col-span-4 col-span-12">
							<div className="grid grid-cols-12 gap-x-6">								
							<div className="xl:col-span-12 col-span-12">
								<div className="box">
										<div className="box-header justify-between">
											<div className="box-title">
                                                Sucess rate
											</div>
											<div className="hs-dropdown ti-dropdown">
												<Link href="#!" scroll={false} className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
													aria-expanded="false">
                                                    View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
												</Link>
												<ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Today</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>This Week</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Last Week</Link></li>
												</ul>
											</div>
										</div>
										<div className="box-body">
											<div id="projectAnalysis">
												<ReactApexChart options={Projectdata.ProjectAnalysis.options} series={Projectdata.ProjectAnalysis.series} type="line" width={"100%"} height={315} />
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>
						<div className="xxl:col-span-4 col-span-12">
							<div className="grid grid-cols-12 gap-x-6">								
							<div className="xl:col-span-12 col-span-12">
								<div className="box">
										<div className="box-header justify-between">
											<div className="box-title">
                                                Request product breakdown
											</div>
											<div className="hs-dropdown ti-dropdown">
												<Link href="#!" scroll={false} className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
													aria-expanded="false">
                                                    View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
												</Link>
												<ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Today</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>This Week</Link></li>
													<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
														href="#!" scroll={false}>Last Week</Link></li>
												</ul>
											</div>
										</div>
										<div className="box-body">
											<div id="projectAnalysis">
												<ReactApexChart options={Projectdata.ProjectAnalysis.options} series={Projectdata.ProjectAnalysis.series} type="line" width={"100%"} height={315} />
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>

					</div> */}
	

					<div className="box-body space-y-3">
							<div className="overflow-hidden">
								<div id="reactivity-table" className="ti-custom-table ti-striped-table ti-custom-table-hover">
								
									<ResponsiveDataTable />
								</div>
							</div>
						</div>
		</Fragment>
	);

}



export const COLUMNS = [
	{
		Header: "Products",
		accessor: "products",
	},
	{
		Header: "Title",
		accessor: "title",
	},
	{
		Header: "Assignee",
		accessor: "assignee",
	},
	{
		Header: "Deadline",
		accessor: "deadline",
	},
	{
		Header: "Task / Time",
		accessor: "tasks",
	},
	{
		Header: "Status",
		accessor: "status",
	},
	{
		Header: "Actions",
		accessor: "actions",
	},
];

function getStatusBadge(status) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

	

    const iconStyle = { marginRight: '8px' };
    const buttonStyle = { 
        width: '120px', 
        color: '#FFF', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '5px',
        position: 'relative' // To position the dropdown
    };

    const statuses = [
        { key: 'request', label: 'Request', color: '#FFA500', icon: <FaLightbulb style={iconStyle} /> },
        { key: 'viewed', label: 'Viewed', color: '#32CD32', icon: <FaEye style={iconStyle} /> },
        { key: 'assigned', label: 'Assigned', color: '#FF6347', icon: <FaClipboard style={iconStyle} /> },
        { key: 'pastDue', label: 'Past Due', color: '#DC143C', icon: <FaExclamationTriangle style={iconStyle} /> },
        { key: 'merged', label: 'Merged', color: '#1E90FF', icon: <FaCodeBranch style={iconStyle} /> },
        { key: 'completed', label: 'Completed', color: '#1E90FF', icon: <FaCheck style={iconStyle} /> },
    ];

    const currentStatusObj = statuses.find(status => status.key === currentStatus);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleStatusChange = (status) => {
        setCurrentStatus(status.key);
        setIsOpen(false);
    };

    return (
        <div style={{ ...buttonStyle }}>
            <Button 
                style={{ backgroundColor: currentStatusObj.color, ...buttonStyle }}
                onClick={toggleDropdown}
            >
                {currentStatusObj.icon} {currentStatusObj.label}
            </Button>
            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', left: '0', zIndex: '1000', backgroundColor: '#FFF', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    {statuses.map(status => (
                        <div 
                            key={status.key} 
                            onClick={() => handleStatusChange(status)} 
                            style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#FFF', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}
                        >
                            {status.icon} {status.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
  
  function getProgressColor(status) {
	switch (status) {
	  case 'request':
		return '#FFA500'; // Orange
	  case 'viewed':
		return '#32CD32'; // Lime Green
	  case 'assigned':
		return '#FF6347'; // Tomato Red
	  case 'pastDue':
		return '#DC143C'; // Crimson
	  case 'merged':
		return '#1E90FF'; // Dodger Blue
	  case 'completed':
		return '#1E90FF'; // Dodger Blue
	  default:
		return '#B88400'; // Golden Brown
	}
  }
  
  function getTimeProgressColor(percentTime, percentTask) {
	if (percentTask >= percentTime) {
		return '#32CD32'; // Green
	} else if (percentTime >= percentTask + 10) {
		return '#FF6347'; // Red
	} else if (percentTime >= percentTask) {
		return '#FFFF00'; // Yellow
	} else {
		return '#B88400'; // Golden Brown (default)
	}
  }

  const assignees = ['',"Geordi La Forge", "Reginald Barclay", "Leah Brahms", "Westley Crusher"]


  function calculateDeadlineAndPercentage(
	startDate,
	deadline,
	timeZone = defaultTimeZone
  ){
	if (!startDate || !deadline ){
	  return {
		deadline: 'N/A',
		percentageElapsed: 0,
	  };
  }
	const deadlineDateISO = calculateCompleteDeadline(startDate, deadline, timeZone);
	const start = moment.tz(startDate, timeZone).toDate();
	const deadlineDate = moment.tz(deadlineDateISO, timeZone).toDate();
	const now = new Date();
  
	const totalDuration = deadlineDate.getTime() - start.getTime();
	const elapsedDuration = now.getTime() - start.getTime();
  
	const percentageElapsed = Math.min(Math.max((elapsedDuration / totalDuration) * 100, 0), 100);
  
	return {
	  deadline,
	  percentageElapsed,
	};
  }

  const defaultTimeZone = 'America/Chicago';

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function nextMonday(date) {
  const day = date.getUTCDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  return add(date, daysUntilMonday, 'day');
}

function parseDeadline(deadline) {
  const parts = deadline.split(' ');
  const amount = parseInt(parts[0], 10);
  const unit = parts[1].toLowerCase();

  return { amount, unit };
}

  export function calculateCompleteDeadline(
	startDate, 
	deadline, 
	timeZone = defaultTimeZone
  ) {
	if (!startDate || !deadline ){
		return 'N/A';
	}
  
	const workStartHour = 8;
	const workEndHour = 17;
	const workDayHours = 9;
  
	let start = moment.tz(startDate, timeZone).toDate();
	let currentDate = new Date(start);
	const { amount, unit } = parseDeadline(deadline);
	
	let remainingTime = unit === 'days' || unit === 'day' ? amount * workDayHours : amount;
  
	while (remainingTime > 0) {
	  if (isWeekend(currentDate)) {
		currentDate = nextMonday(currentDate);
	  } else if (currentDate.getHours() < workStartHour) {
		currentDate.setHours(workStartHour, 0, 0, 0);
	  } else if (currentDate.getHours() >= workEndHour) {
		currentDate = add(currentDate, 1, 'day');
		currentDate.setHours(workStartHour, 0, 0, 0);
	  } else {
		const remainingWorkHoursToday = workEndHour - currentDate.getHours();
		if (remainingTime <= remainingWorkHoursToday) {
		  currentDate = add(currentDate, remainingTime, 'hours');
		  remainingTime = 0;
		} else {
		  currentDate = add(currentDate, remainingWorkHoursToday, 'hours');
		  currentDate = add(currentDate, 1, 'day');
		  currentDate.setHours(workStartHour, 0, 0, 0);
		  remainingTime -= remainingWorkHoursToday;
		}
	  }
	}
  
	const completeDeadline = moment.tz(currentDate, timeZone).toDate();
	return formatISO(completeDeadline);
  }
  

const mapDataToColumns = (data, columns) => {

	return data.map(item => {
	  let mappedItem = {};
	  
	  columns.forEach(column => {
		switch (column.accessor) {
		  case 'products':
			mappedItem[column.accessor] = item.productTags ? item.productTags.join(', ') : 'N/A';
			break;
		  case 'title':
			mappedItem[column.accessor] = item.title;
			break;
		  case 'assignee':
			// You can map assigneeID to actual names if you have a lookup table, or just use the ID
			mappedItem[column.accessor] = item.assigneeID ? assignees[item.assigneeID] : 'N/A';
			break;
		  case 'deadline':
			mappedItem[column.accessor] = item.deadline ? `${item.deadline.periodNum} ${item.deadline.period}(s)` : 'N/A';
			break;
		  case 'tasks':
			const deadline = `${item.deadline.periodNum} ${item.deadline.period}`;

			const startDate = item.startDate;
			const timeZone = 'America/Chicago';		
			const completeDeadlinePercentage = calculateDeadlineAndPercentage(startDate, deadline, timeZone);
			const completeDeadline = completeDeadlinePercentage.deadline;
			const percentTime = completeDeadlinePercentage.percentageElapsed;
			const percentTask = (item.completedTasks.length / item.tasks.length) * 100;
			const formattedPercentage = percentTask.toFixed(0);
			const formattedTimePercentage = percentTime.toFixed(0);
			const color = getTimeProgressColor(percentTime, percentTask);

			mappedItem[column.accessor] = item.tasks.length > 0 ? 
			(<div className="flex items-center">
			<PercentRing percent={formattedPercentage} radius={25} stroke={4} fontSize={10} color={color} />
			<PercentRing percent={formattedTimePercentage} radius={25} stroke={4} fontSize={10} color={color} />
			</div>)
			: item.tasks.length;
			break;
		  case 'status':
			mappedItem[column.accessor] = item.status ? <StatusBadge  initialStatus={item.status} />  : 'N/A';
			break;
		  case 'actions':
			mappedItem[column.accessor] = '<Actions Here>'; // Placeholder for actions if needed
			break;
		  default:
			mappedItem[column.accessor] = 'N/A';
		}
	  });
  
	  return mappedItem;
	});
  };
  
  // Example usage
  


const createId = () => {
	const id = Math.floor(Math.random() * 1000000);	
}			

export const DATATABLE = [
	
	{
      id: createId(),
      title: "Train new recruit on dilithium recrystallization procedure",
      productTags: ["Onboarding", "Compliance"],
      initiativeTags: ["Cybersecurity", "API"],
      assigneeID: 1,
      intro: "Before starting the dilithium recrystallization procedure, it's essential to understand the importance of each step and the safety protocols involved. Dilithium crystals are a critical component in the operation of the warp core, and proper handling and recrystallization are vital for maintaining the stability and efficiency of the starship's propulsion system. This training will provide the recruit with a comprehensive understanding of the procedures, safety measures, and hands-on experience needed to perform recrystallization effectively and safely.",
      tasks: [
        {
          title: "Explain warpcore magnetic containment",
          text: "Provide a detailed explanation of the magnetic containment system used in the warpcore to stabilize the antimatter and matter reactions. Include diagrams and safety protocols."
        },
        {
          title: "Demonstrate dilithium crystal handling",
          text: "Show the proper techniques for handling dilithium crystals, including how to safely install and remove them from the warp core. Emphasize the importance of protective gear."
        },
        {
          title: "Review dilithium recrystallization process",
          text: "Walk through the step-by-step procedure for recrystallizing dilithium. Cover the necessary equipment, conditions required, and potential hazards to watch out for."
        },
        {
          title: "Conduct practical exercise on recrystallization",
          text: "Have the recruit perform a supervised recrystallization of a dilithium crystal. Provide guidance and feedback to ensure proper technique and safety are maintained throughout the process."
        }
      ],
      outro: "Completing the dilithium recrystallization procedure requires precision, attention to detail, and adherence to safety protocols. By following these steps, the recruit will gain the necessary skills and confidence to handle and recrystallize dilithium crystals effectively. Regular practice and continuous learning are encouraged to maintain proficiency in these critical operations. Remember, the safety and efficiency of the warp core depend on the proper execution of these procedures. Stay vigilant and always prioritize safety.",
      completedTasks: ["Explain warpcore magnetic containment"],
      status: 'viewed',
      original: "",
      generated: "",
      createdDate: "2024-08-05T10:30:00Z",
      startDate: "2024-08-09T14:30:00Z",
      turnaround: {
        period: 'hour',
        periodNum: 8
      },
      deadline: {
        period: 'day',
        periodNum: 2
      }
    },
    {
      id: createId(),
      title: "Upgrade warp core containment field",
      productTags: ["Backoffice", "Maintenance"],
      initiativeTags: ["Safety", "Backoffice"],
      assigneeID: 2,
      intro: "The warp core containment field is a critical component for the safe operation of a starship. Upgrading this field will enhance the stability and safety of the warp core, reducing the risk of containment breaches and improving overall efficiency. This task involves reviewing the current containment field, identifying potential weaknesses, and implementing necessary upgrades to ensure optimal performance.",
      tasks: [
        {
          title: "Inspect current containment field",
          text: "Perform a thorough inspection of the existing warp core containment field. Document any areas that show signs of wear or potential failure."
        },
        {
          title: "Research latest containment technologies",
          text: "Investigate the latest advancements in containment field technologies. Evaluate which solutions could be integrated into the current system."
        },
        {
          title: "Develop upgrade plan",
          text: "Create a detailed plan outlining the steps required to upgrade the containment field. Include necessary materials, safety protocols, and a timeline for implementation."
        },
        {
          title: "Implement upgrades",
          text: "Execute the upgrade plan, installing new components and making necessary adjustments to the containment field. Ensure all safety measures are strictly followed."
        }
      ],
      outro: "Upgrading the warp core containment field is essential for maintaining the safety and efficiency of the starship. By carefully inspecting, researching, and implementing the latest technologies, we can ensure the warp core operates within safe parameters. Continuous monitoring and regular maintenance are crucial to sustaining these improvements. Always prioritize safety and be vigilant for any signs of containment field degradation.",
      completedTasks: ["Inspect current containment field", "Research latest containment technologies"],
      status: 'pastDue',
      original: "",
      generated: "",
      createdDate: "2024-08-01T10:30:00Z",
      startDate: "2024-08-09T03:30:00Z",
      turnaround: {
        period: 'hour',
        periodNum: 12
      },
      deadline: {
        period: 'hour',
        periodNum: 20
      }
    },
    {
      id: createId(),
      title: "Optimize Teleporter Systems",
      productTags: ["Backoffice (general)", "Pipeline"],
      initiativeTags: ["UI", "Cybersecurity"],
      assigneeID: 3,
      intro: "Teleporter systems are crucial for the efficient and safe transportation of personnel and cargo on a starship. Optimizing these systems will ensure faster and more reliable teleportation, minimizing errors and enhancing overall operational efficiency. This task involves evaluating the current teleporter systems, identifying bottlenecks, and implementing improvements to boost performance and security.",
      tasks: [
        {
          title: "Assess current teleporter performance",
          text: "Conduct a comprehensive assessment of the existing teleporter systems. Measure teleportation accuracy, speed, and reliability, and document any issues or inefficiencies."
        },
        {
          title: "Research teleporter system advancements",
          text: "Explore the latest advancements in teleporter technology. Identify potential upgrades or modifications that could be applied to enhance system performance."
        },
        {
          title: "Develop optimization plan",
          text: "Create a detailed plan for optimizing the teleporter systems. Outline the steps required, necessary resources, and a timeline for implementation."
        },
        {
          title: "Implement teleporter optimizations",
          text: "Execute the optimization plan, making necessary adjustments and upgrades to the teleporter systems. Ensure all changes are thoroughly tested for safety and efficiency."
        }
      ],
      outro: "Optimizing the teleporter systems is essential for ensuring the smooth and efficient operation of the starship's transportation capabilities. By carefully assessing, researching, and implementing the latest technologies, we can significantly enhance teleporter performance and reliability. Continuous monitoring and regular updates will be necessary to maintain these improvements. Always prioritize safety and accuracy in all teleportation procedures.",
      completedTasks: ["Assess current teleporter performance", "Research teleporter system advancements", "Develop optimization plan", "Implement teleporter optimizations"],
      status: 'completed',
      original: "",
      generated: "",
      createdDate: "2024-08-02T10:30:00Z",
      startDate: "2024-08-08T03:30:00Z",
      turnaround: {
        period: 'day',
        periodNum: 1
      },
      deadline: {
        period: 'week',
        periodNum: 1
      }
    },
    {
      id: createId(),
      title: "Develop Strategy for Borg Adaptive Shield Deactivation",
      productTags: ["Analyst", "Compliance"],
      initiativeTags: ["API", "Cybersecurity"],
      assigneeID: 4,
      intro: "Borg adaptive shields are a formidable defense mechanism, constantly adjusting to counteract various types of attacks. Developing a strategy to deactivate these shields is critical for enhancing our tactical capabilities against Borg threats. This task involves analyzing the adaptive nature of Borg shields, identifying potential vulnerabilities, and creating a plan to exploit these weaknesses.",
      tasks: [
        {
          title: "Analyze Borg shield adaptation patterns",
          text: "Study the adaptation patterns of Borg shields during past encounters. Identify common responses to different types of attacks and document the findings."
        },
        {
          title: "Identify potential vulnerabilities",
          text: "Using the analysis of adaptation patterns, pinpoint potential weaknesses in the Borg shields. Consider unconventional methods and technologies that may exploit these vulnerabilities."
        },
        {
          title: "Develop deactivation plan",
          text: "Create a comprehensive plan for deactivating Borg adaptive shields. Include specific techniques, necessary equipment, and a step-by-step approach for implementation."
        }
      ],
      outro: "Successfully deactivating Borg adaptive shields requires a deep understanding of their adaptation mechanisms and innovative strategies to exploit identified vulnerabilities. This project will significantly enhance our defensive and offensive capabilities against Borg threats. Regular updates and refinements to the strategy will be essential as new information and technologies become available. Always prioritize thorough analysis and precise execution in these high-stakes operations.",
      completedTasks: ["Analyze Borg shield adaptation patterns"],
      status: 'assigned',
      original: "",
      generated: "",
      createdDate: "2024-08-02T00:30:00Z",
      startDate: "2024-08-08T18:30:00Z",
      turnaround: {
        period: 'day',
        periodNum: 3
      },
      deadline: {
        period: 'day',
        periodNum: 3
      }
    },
    {
      id: createId(),
      title: "Develop Strategy for Borg Adaptive Shield Deactivation",
      productTags: ["Analyst", "Compliance"],
      initiativeTags: ["API", "Cybersecurity"],
      assigneeID: 4,
      intro: "Borg adaptive shields are a formidable defense mechanism, constantly adjusting to counteract various types of attacks. Developing a strategy to deactivate these shields is critical for enhancing our tactical capabilities against Borg threats. This task involves analyzing the adaptive nature of Borg shields, identifying potential vulnerabilities, and creating a plan to exploit these weaknesses.",
      tasks: [
        {
          title: "Analyze Borg shield adaptation patterns",
          text: "Study the adaptation patterns of Borg shields during past encounters. Identify common responses to different types of attacks and document the findings."
        },
        {
          title: "Identify potential vulnerabilities",
          text: "Using the analysis of adaptation patterns, pinpoint potential weaknesses in the Borg shields. Consider unconventional methods and technologies that may exploit these vulnerabilities."
        },
        {
          title: "Develop deactivation plan",
          text: "Create a comprehensive plan for deactivating Borg adaptive shields. Include specific techniques, necessary equipment, and a step-by-step approach for implementation."
        }
      ],
      outro: "Successfully deactivating Borg adaptive shields requires a deep understanding of their adaptation mechanisms and innovative strategies to exploit identified vulnerabilities. This project will significantly enhance our defensive and offensive capabilities against Borg threats. Regular updates and refinements to the strategy will be essential as new information and technologies become available. Always prioritize thorough analysis and precise execution in these high-stakes operations.",
      completedTasks: [],
      status: 'request',
      original: "",
      generated: "",
      createdDate: "2024-08-02T00:30:00Z",
      startDate: "",
      turnaround: {
        period: 'day',
        periodNum: 3
      },
      deadline: {
        period: 'day',
        periodNum: 3
      }
    }
    
    
    ];

	const mutatedData = mapDataToColumns(DATATABLE, COLUMNS);


 const ResponsiveDataTable = () => {
	const tableInstance = useTable(
		{
			columns: COLUMNS,
			data: mutatedData,
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const {
		getTableProps, // table props from react-table
		headerGroups, // headerGroups, if your table has groupings
		getTableBodyProps, // table body props from react-table
		prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
		state,
		setGlobalFilter,
		page, // use, page or rows
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		gotoPage,
		pageCount,
		setPageSize,
	} = tableInstance;

	const { globalFilter, pageIndex, pageSize } = state;

	return (
		<>
			<div className="e-table z-index-99999 p-8">
				<div className="flex mb-4">
					<select
						className=" selectpage border me-1"
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						{[5, 20, 100, 500].map((pageSize) => (
							<option key={Math.random()} value={pageSize}>
                Show {pageSize}
							</option>
						))}
					</select>
					<GlobalResFilter filter={globalFilter} setFilter={setGlobalFilter} />
				</div>
				<div className="table-responsive table-bordered text-center">
					<table
						{...getTableProps()}
						className="border-top-0  table-bordered text-nowrap border-bottom"
					>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
									{headerGroup.headers.map((column) => (
										<th
											{...column.getHeaderProps(column.getSortByToggleProps())}
											className={column.className} key={Math.random()}
										>
											<Fragment key={Math.random()}>
												<span className="tabletitle">
													{column.render("Header")}
												</span>
												<span>
													{column.isSorted ? (
														column.isSortedDesc ? (
															<i className="fa fa-angle-down"></i>
														) : (
															<i className="fa fa-angle-up"></i>
														)
													) : (
														""
													)}
												</span>
											</Fragment>
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody {...getTableBodyProps()}>
							{page.map((row) => {
								prepareRow(row);
								return (
									<tr
										className="text-center"
										{...row.getRowProps()}
										key={Math.random()}
									>
										{row.cells.map((cell) => {
											return (
												<td {...cell.getCellProps()} key={Math.random()}>
													{cell.render("Cell")}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{ pageOptions.length > 1 && (
				<div className="block sm:flex mt-4">
					<div className="">
            Page{" "}
						<strong>
							{pageIndex + 1} of {pageOptions.length}
						</strong>{" "}
					</div>
					<div className="sm:ms-auto float-right my-1 sm:my-0 ">
						<button
           
							className="btn-outline-light tablebutton me-2 mb-2 sm:mb-0 sm:inline block"
							onClick={() => gotoPage(0)}
							disabled={!canPreviousPage}
						>
							{" Previous "}
						</button>
						<button
           
							className="btn-outline-light tablebutton me-2 mb-2 sm:mb-0"
							onClick={() => {
								previousPage();
							}}
							disabled={!canPreviousPage}
						>
							{" << "}
						</button>
						<button
           
							className="btn-outline-light tablebutton me-2 mb-2 sm:mb-0"
							onClick={() => {
								previousPage();
							}}
							disabled={!canPreviousPage}
						>
							{" < "}
						</button>
						<button
           
							className="btn-outline-light tablebutton me-2 mb-2 sm:mb-0"
							onClick={() => {
								nextPage();
							}}
							disabled={!canNextPage}
						>
							{" > "}
						</button>
						<button
           
							className="btn-outline-light tablebutton me-2 mb-2 sm:mb-0"
							onClick={() => {
								nextPage();
							}}
							disabled={!canNextPage}
						>
							{" >> "}
						</button>
						<button
           
							className="btn-outline-light tablebutton sm:inline block"
							onClick={() => gotoPage(pageCount - 1)}
							disabled={!canNextPage}
						>
							{" Next "}
						</button>
					</div>
				</div>)}
			</div> 
	
		</>
	);
};


	const RequestTable = () => {
		const requestData = requestSummaryData;
  console.log(requestData);
	  
		const formatDeadline = (deadline) => {
		  const deadlineDate = new Date(deadline.periodNum * (deadline.period === 'day' ? 24 : 1) * 60 * 60 * 1000);
		  return formatDistanceToNow(deadlineDate);
		};
	  
		const formatProcess = (tasks, completedTasks) => {
		  const totalTasks = tasks.length;
		  const completed = completedTasks.length;
		  return `${completed} of ${totalTasks} tasks completed`;
		};
	  
		const getStatusClass = (status) => {
		  switch (status) {
			case 'viewed': return 'text-info';
			case 'in-progress': return 'text-warning';
			case 'completed': return 'text-success';
			default: return 'text-secondary';
		  }
		};
	  
		return (
		  <div className="grid grid-cols-12 gap-x-6">
			<div className="xxl:col-span-12 col-span-12">
			  <div className="box">
				<div className="box-header justify-between">
				  <div className="box-title">
					Projects Summary
				  </div>
				  <div className="flex flex-wrap">
					<div className="me-4 my-1">
					  <input className="ti-form-control form-control-sm !rounded-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
					</div>
					<div className="hs-dropdown ti-dropdown !py-1 !mb-2">
					  <Link href="#!" scroll={false}
						className="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
						aria-expanded="false">
						Sort By<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
					  </Link>
					  <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
						<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
						  href="#!" scroll={false}>New</Link></li>
						<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
						  href="#!" scroll={false}>Popular</Link></li>
						<li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
						  href="#!" scroll={false}>Relevant</Link></li>
					  </ul>
					</div>
				  </div>
				</div>
				<div className="box-body">
				  <div className="table-responsive">
					<table className="table table-hover whitespace-nowrap table-bordered min-w-full">
					  <thead>
						<tr>
						  <th scope="col" className="!text-start">Title</th>
						  <th scope="col" className="!text-start">Assigned To</th>
						  <th scope="col" className="!text-start">Tasks</th>
						  <th scope="col" className="!text-start">Progress</th>
						  <th scope="col" className="!text-start">Status</th>
						  <th scope="col" className="!text-start">Due Date</th>
						</tr>
					  </thead>
					  <tbody>
						{requestData.map((request, index) => (
						  <tr key={request.id} className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
							<td>{request.title}</td>
							<td>
							  <div className="avatar-list-stacked">
								{/* Example Avatar */}
								<span className="avatar avatar-xs avatar-rounded">
								  <img src="../../assets/images/faces/2.jpg" alt="img" />
								</span>
								{/* Additional avatars or dynamic rendering based on the data can be added here */}
								<Link className="avatar avatar-xs bg-primary avatar-rounded text-white text-[0.65rem] font-normal" href="#!" scroll={false}>
								  +2
								</Link>
							  </div>
							</td>
							<td>{formatProcess(request.tasks, request.completedTasks)}</td>
							<td>{formatProcess(request.tasks, request.completedTasks)}</td>
							<td className={getStatusClass(request.status)}>{request.status}</td>
							<td>{formatDeadline(request.deadline)}</td>
						  </tr>
						))}
					  </tbody>
					</table>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		);
};

const GlobalResFilter = ({ filter, setFilter }) => {
	return (
		<span className="ms-auto">
			<input
				value={filter || ""}
				onChange={(e) => setFilter(e.target.value)}
				className="form-control !w-auto"
				placeholder="Search..."
			/>
		</span>
	);
};




export default Projects;
