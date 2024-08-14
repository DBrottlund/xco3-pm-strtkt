"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { ThemeChanger } from "../../redux/action";
import { connect } from "react-redux";
import store from "@/shared/redux/store";
import Modalsearch from "../modal-search/modalsearch";
import { basePath } from "@/next.config";
import { useRouter } from "next/navigation";

const Header = ({ local_varaiable, ThemeChanger }) => {

	const [passwordshow1, setpasswordshow1] = useState(false);

	const data=  <span className="font-[600] py-[0.25rem] px-[0.45rem] rounded-[0.25rem] bg-pinkmain/10 text-pinkmain text-[0.625rem]">Free shipping</span>;



	//Notifications

	const span1 = <span className="text-warning">ID: #1116773</span>;
	const span2 = <span className="text-success">ID: 7731116</span>;




	useEffect(() => {
		const handleResize = () => {
			const windowObject = window;
			if (windowObject.innerWidth <= 991) {
				// ThemeChanger({ ...local_varaiable, "dataToggled": "close" })
			} else {
				// ThemeChanger({...local_varaiable,"dataToggled":""})
			}
		};
		handleResize(); // Check on component mount
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);



	function menuClose() {
		const theme = store.getState();
		if (window.innerWidth <= 992) {
			ThemeChanger({ ...theme, dataToggled: "close" });
		}
		if (window.innerWidth >= 992) {
			ThemeChanger({ ...theme, dataToggled: local_varaiable.dataToggled ? local_varaiable.dataToggled : "" });
			// local_varaiable.dataHeaderStyles == 'dark' ? 'light' : 'dark',
		}
	}


	const toggleSidebar = () => { 
		const theme = store.getState();
		let sidemenuType = theme.dataNavLayout;
		if (window.innerWidth >= 992) {
			if (sidemenuType === "vertical") {
				let verticalStyle = theme.dataVerticalStyle;
				const navStyle = theme.dataNavStyle;
				switch (verticalStyle) {
				// closed
				case "closed":
					ThemeChanger({ ...theme, "dataNavStyle": "" });
					if (theme.dataToggled === "close-menu-close") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "close-menu-close" });
					}
					break;
					// icon-overlay
				case "overlay":
					ThemeChanger({ ...theme, "dataNavStyle": "" });
					if (theme.dataToggled === "icon-overlay-close") {
						ThemeChanger({ ...theme, "dataToggled": "","iconOverlay" :""});
					} else {
						if (window.innerWidth >= 992) {
							ThemeChanger({ ...theme, "dataToggled": "icon-overlay-close","iconOverlay" :"" });
						}
					}
					break;
					// icon-text
				case "icontext":
					ThemeChanger({ ...theme, "dataNavStyle": "" });
					if (theme.dataToggled === "icon-text-close") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "icon-text-close" });
					}
					break;
					// doublemenu
				case "doublemenu":
					ThemeChanger({ ...theme, "dataNavStyle": "" });
					ThemeChanger({ ...theme, "dataNavStyle": "" });
					if (theme.dataToggled === "double-menu-open") {
						ThemeChanger({ ...theme, "dataToggled": "double-menu-close" });
					} else {
						let sidemenu = document.querySelector(".side-menu__item.active");
						if (sidemenu) {
							ThemeChanger({ ...theme, "dataToggled": "double-menu-open" });
							if (sidemenu.nextElementSibling) {
								sidemenu.nextElementSibling.classList.add("double-menu-active");
							} else {

								ThemeChanger({ ...theme, "dataToggled": "double-menu-close" });
								// ThemeChanger({ ...theme, "dataToggled": "" });
							}
						}
					}
					// doublemenu(ThemeChanger);
					break;
					// detached
				case "detached":
					if (theme.dataToggled === "detached-close") {
						ThemeChanger({ ...theme, "dataToggled": "","iconOverlay" :"" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "detached-close","iconOverlay" :"" });
					}
            
					break;

					// default
				case "default":
					ThemeChanger({ ...theme, "dataToggled": "" });
				}
				switch (navStyle) {
				case "menu-click":
					if (theme.dataToggled === "menu-click-closed") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					}
					else {
						ThemeChanger({ ...theme, "dataToggled": "menu-click-closed" });
					}
					break;
					// icon-overlay
				case "menu-hover":
					if (theme.dataToggled === "menu-hover-closed") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "menu-hover-closed"});

					}
					break;
				case "icon-click":
					if (theme.dataToggled === "icon-click-closed") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "icon-click-closed" });

					}
					break;
				case "icon-hover":
					if (theme.dataToggled === "icon-hover-closed") {
						ThemeChanger({ ...theme, "dataToggled": "" });
					} else {
						ThemeChanger({ ...theme, "dataToggled": "icon-hover-closed" });

					}
					break;

				}
			}
		}
		else {
			if (theme.dataToggled === "close") {
				ThemeChanger({ ...theme, "dataToggled": "open" });

				setTimeout(() => {
					if (theme.dataToggled == "open") {
						const overlay = document.querySelector("#responsive-overlay");

						if (overlay) {
							overlay.classList.add("active");
							overlay.addEventListener("click", () => {
								const overlay = document.querySelector("#responsive-overlay");

								if (overlay) {
									overlay.classList.remove("active");
									menuClose();
								}
							});
						}
					}

					window.addEventListener("resize", () => {
						if (window.screen.width >= 992) {
							const overlay = document.querySelector("#responsive-overlay");

							if (overlay) {
								overlay.classList.remove("active");
							}
						}
					});
				}, 100);
			} else {
				ThemeChanger({ ...theme, "dataToggled": "close" });
			}
		}

	};
	//Dark Model

	const ToggleDark = () => {

		ThemeChanger({
			...local_varaiable,
			"class": local_varaiable.class == "dark" ? "light" : "dark",
			"dataHeaderStyles":local_varaiable.class == "dark" ? "light" : "dark",
			"dataMenuStyles": local_varaiable.dataNavLayout == "horizontal" ? local_varaiable.class == "dark" ? "light" : "dark" : "dark"

		});
		const theme = store.getState();

		if (theme.class != "dark") {

			ThemeChanger({
				...theme,
				"bodyBg": "",
				"Light": "",
				"darkBg": "",
				"inputBorder": "",
			});
			localStorage.setItem("ynexlighttheme", "light");
			localStorage.removeItem("ynexdarktheme");
			localStorage.removeItem("ynexMenu");
			localStorage.removeItem("ynexHeader");
			localStorage.removeItem("darkBgRGB");
		}
		else {
			localStorage.setItem("ynexdarktheme", "dark");
			localStorage.removeItem("ynexlighttheme");
			localStorage.removeItem("ynexMenu");
			localStorage.removeItem("ynexHeader");
		}

	};

	useEffect(() => {
		const navbar = document?.querySelector(".header");
		const navbar1 = document?.querySelector(".app-sidebar");
		const sticky = navbar?.clientHeight;
		// const sticky1 = navbar1.clientHeight;

		function stickyFn() {
			if (window.pageYOffset >= sticky) {
				navbar?.classList.add("sticky-pin");
				navbar1?.classList.add("sticky-pin");
			} else {
				navbar?.classList.remove("sticky-pin");
				navbar1?.classList.remove("sticky-pin");
			}
		}

		window.addEventListener("scroll", stickyFn);
		window.addEventListener("DOMContentLoaded", stickyFn);

		// Cleanup event listeners when the component unmounts
		return () => {
			window.removeEventListener("scroll", stickyFn);
			window.removeEventListener("DOMContentLoaded", stickyFn);
		};
	}, []);

	return (
		<Fragment>
			<div className="app-header">
				<nav className="main-header !h-[3.75rem]" aria-label="Global">
					<div className="main-header-container ps-[0.725rem] pe-[1rem] ">

						<div className="header-content-left">
							<div className="header-element">
								<div className="horizontal-logo">
									<Link href="/dashboard/" className="header-logo">
										
									</Link>
								</div>
							</div>
							<div className="header-element md:px-[0.325rem] !items-center" onClick={() => toggleSidebar()}>
								<Link aria-label="Hide Sidebar"
									className="sidemenu-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center" href="#!" scroll={false}><span></span></Link>
							</div>
						</div>
						<div className="header-content-right">

							{/* <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
								<button aria-label="button" type="button" data-hs-overlay="#search-modal"
									className="inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10">
									<i className="bx bx-search-alt-2 header-link-icon"></i>
								</button>
							</div> */}
						
							<div className="header-element header-theme-mode hidden !items-center sm:block !py-[1rem] md:!px-[0.65rem] px-2" onClick={() => ToggleDark()}>
								<button aria-label="anchor"
									className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
									data-hs-theme-click-value="dark">
									<i className="bx bx-moon header-link-icon"></i>
								</button>
								<button aria-label="anchor"
									className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium text-defaulttextcolor  transition-all text-xs  dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
									data-hs-theme-click-value="light">
									<i className="bx bx-sun header-link-icon"></i>
								</button>
							</div>

							{/* <div className="header-element header-apps dark:text-[#8c9097] dark:text-white/50 py-[1rem] md:px-[0.65rem] px-2 hs-dropdown ti-dropdown md:!block !hidden [--placement:bottom-left]">

								<button aria-label="button" id="dropdown-apps" type="button"
									className="hs-dropdown-toggle ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs">
									<i className="bx bx-grid-alt header-link-icon text-[1.125rem]"></i>
								</button>

								<div
									className="main-header-dropdown !-mt-3 hs-dropdown-menu ti-dropdown-menu !w-[22rem] border-0 border-defaultborder   hidden"
									aria-labelledby="dropdown-apps">

									<div className="p-4">
										<div className="flex items-center justify-between">
											<p className="mb-0 text-defaulttextcolor text-[1.0625rem]  font-semibold">Related Apps</p>
										</div>
									</div>
									<div className="dropdown-divider mb-0"></div>
									<div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10 main-header-shortcuts p-2" id="header-shortcut-scroll">
										<div className="grid grid-cols-3 gap-2">
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<div>
														<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/figma.png`} alt="figma"
															className="!h-[1.75rem] !w-[1.75rem] text-2xl avatar text-primary flex justify-center items-center mx-auto" />
														<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Figma</div>
													</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/microsoft-powerpoint.png`} alt="miscrosoft"
														className="leading-[1.75] text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Power Point</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/microsoft-word.png`} alt="miscrodoftword"
														className="leading-none
                         text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"/>
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">MS Word</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/calender.png`} alt="calander"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Calendar</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/sketch.png`} alt="apps"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Sketch</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/google-docs.png`} alt="docs"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Docs</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/google.png`} alt="google"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Google</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/translate.png`} alt="translate"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Translate</div>
												</Link>
											</div>
											<div className="">
												<Link href="#!" scroll={false} className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20">
													<img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/apps/google-sheets.png`} alt="sheets"
														className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto" />
													<div className="text-[0.75rem] text-defaulttextcolor dark:text-white">Sheets</div>
												</Link>
											</div>
										</div>
									</div>
									<div className="p-4 first:pt-0 border-t">
										<Link className="w-full ti-btn ti-btn-primary-full p-2 !m-0" href="#!" scroll={false}>
                      View All
										</Link>
									</div>

								</div>
							</div> */}

							<div className="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]">

								<button id="dropdown-profile" type="button"
									className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent ">
									<img className="inline-block rounded-full " src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/faces/9.jpg`} width="32" height="32" alt="Image Description" />
								</button>
								<div className="md:block hidden dropdown-profile">
									<p className="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] ">Derek Brottlund</p>
									<span className="opacity-[0.7] font-normal text-[#536485] block text-[0.6875rem] ">Project Manger</span>
								</div>
								<div
									className="hs-dropdown-menu ti-dropdown-menu !-mt-3 border-0 w-[11rem] !p-0 border-defaultborder hidden main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
									aria-labelledby="dropdown-profile">

									<ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
										{/* <li>
											<Link className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem]" href="#!">
												<i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Profile
											</Link>
										</li>
										<li>
											<Link className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] " href="#!"><i
												className="ti ti-inbox text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Inbox <span
												className="!py-1 !px-[0.45rem] !font-semibold !rounded-sm text-success text-[0.75em] bg-success/10 ms-auto">25</span>
											</Link>
										</li>
										<li><Link className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem]" href="#!"><i
											className="ti ti-clipboard-check text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Task Manager</Link></li>
										<li><Link className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem]" href="#!"><i
											className="ti ti-adjustments-horizontal text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Settings</Link></li>
										<li><Link className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem] " href="#!" scroll={false}><i
											className="ti ti-wallet text-[1.125rem] me-2 opacity-[0.7 !inline-flex"></i>Bal: $7,12,950</Link></li>
										<li><Link className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex" href="#!"><i
											className="ti ti-headset text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Support</Link></li> */}
										<li><Link className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex" href="/logout"><i
											className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>Log Out</Link></li>
									</ul>
								</div>
							</div>
							{/* <div className="header-element md:px-[0.48rem]">
								<button aria-label="button" type="button"
									className="hs-dropdown-toggle switcher-icon inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium  align-middle transition-all text-xs dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
									data-hs-overlay="#hs-overlay-switcher">
									<i className="bx bx-cog header-link-icon animate-spin-slow"></i>
								</button>
							</div> */}
						</div>
					</div>
				</nav>
			</div>
			<Modalsearch />
		</Fragment>
	);
};

const mapStateToProps = (state) => ({
	local_varaiable: state
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
