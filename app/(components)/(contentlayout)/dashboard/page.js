"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment } from "react";
import * as Projectdata from "@/shared/data/dashboards/projectsdata";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Projects = () => {
	return (
		<Fragment>
			<Seo title={"Xco3 Requests"} />
			<Pageheader currentpage="Requests" activepage="Dashboard" mainpage="Projects" />
			
					<div className="grid grid-cols-12 gap-x-6">
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

					</div>
	
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
											<th scope="col" className="!text-start">S.No</th>
											<th scope="col" className="!text-start">Title</th>
											<th scope="col" className="!text-start">Assigned To</th>
											<th scope="col" className="!text-start">Tasks</th>
											<th scope="col" className="!text-start">Progress</th>
											<th scope="col" className="!text-start">Status</th>
											<th scope="col" className="!text-start">Due Date</th>
										</tr>
									</thead>
									<tbody>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                1
											</th>
											<td>
                                                Home Page
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/2.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/8.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/2.jpg" alt="img" />
													</span>
													<Link className="avatar avatar-xs bg-primary avatar-rounded text-white text-[0.65rem] font-normal" href="#!" scroll={false}>
                                                        +2
													</Link>
												</div>
											</td>
											<td>110/180</td>
											<td>
												<div className="flex items-center">
													<div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-0"></div>
													</div>
													<div className="ms-2">0%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-primary/10 text-primary">In Progress</span>
											</td>
											<td>
                                                14-04-2023
											</td>
										</tr>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                2
											</th>
											<td>
                                                Landing Design
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/5.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/6.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/9.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/15.jpg" alt="img" />
													</span>
												</div>
											</td>
											<td>95/100</td>
											<td>
												<div className="flex items-center">
													<div className=" progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={95} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-[95%]"></div>
													</div>
													<div className="ms-2">95%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-primary/10 text-primary">In Progress</span>
											</td>
											<td>
                                                20-04-2023
											</td>
										</tr>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                3
											</th>
											<td>
                                                New Template Design
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/1.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/3.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/4.jpg" alt="img" />
													</span>
												</div>
											</td>
											<td>90/100</td>
											<td>
												<div className="flex items-center">
													<div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-0"></div>
													</div>
													<div className="ms-2">0%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-warning/10 text-warning">Pending</span>
											</td>
											<td>
                                                29-05-2023
											</td>
										</tr>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                4
											</th>
											<td>
                                                HR Management Template Design
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/10.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/11.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/4.jpg" alt="img" />
													</span>
													<Link className="avatar avatar-xs bg-primary avatar-rounded text-white text-[0.65rem] font-normal" href="#!" scroll={false}>
                                                        +5
													</Link>
												</div>
											</td>
											<td>26/71</td>
											<td>
												<div className="flex items-center">
													<div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-[35%]"></div>
													</div>
													<div className="ms-2">35%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-primary/10 text-primary">In Progress</span>
											</td>
											<td>
                                                18-04-2023
											</td>
										</tr>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                5
											</th>
											<td>
                                                Designing New Template
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/2.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/9.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/16.jpg" alt="img" />
													</span>
													<Link className="avatar avatar-xs bg-primary avatar-rounded text-white text-[0.65rem] font-normal" href="#!" scroll={false}>
                                                        +3
													</Link>
												</div>
											</td>
											<td>26/71</td>
											<td>
												<div className="flex items-center">
													<div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-full"></div>
													</div>
													<div className="ms-2">100%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-success/10 text-success">Completed</span>
											</td>
											<td>
                                                11-04-2023
											</td>
										</tr>
										<tr className="border border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10">
											<th scope="row" className="!text-start">
                                                6
											</th>
											<td>
                                                Documentation Project
											</td>
											<td>
												<div className="avatar-list-stacked">
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/4.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/7.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/12.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/13.jpg" alt="img" />
													</span>
													<span className="avatar avatar-xs avatar-rounded">
														<img src="../../assets/images/faces/15.jpg" alt="img" />
													</span>
												</div>
											</td>
											<td>45/90</td>
											<td>
												<div className="flex items-center">
													<div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
														<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-1/2"></div>
													</div>
													<div className="ms-2">50%</div>
												</div>
											</td>
											<td>
												<span className="badge bg-primary/10 text-primary">In Progress</span>
											</td>
											<td>
                                                18-04-2023
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="box-footer">
							<div className="sm:flex items-center">
								<div className="dark:text-defaulttextcolor/70">
                                    Showing 5 Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
								</div>
								<div className="ms-auto">
									<nav aria-label="Page navigation" className="pagination-style-4">
										<ul className="ti-pagination mb-0">
											<li className="page-item disabled">
												<Link className="page-link" href="#!" scroll={false}>
                                                    Prev
												</Link>
											</li>
											<li className="page-item"><Link className="page-link active" href="#!" scroll={false}>1</Link></li>
											<li className="page-item"><Link className="page-link" href="#!" scroll={false}>2</Link></li>
											<li className="page-item">
												<Link className="page-link !text-primary" href="#!" scroll={false}>
                                                    next
												</Link>
											</li>
										</ul>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Projects;
