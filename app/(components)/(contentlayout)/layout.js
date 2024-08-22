"use client";
import React, { createContext, useContext } from 'react';
import PrelineScript from "@/app/Prelinescript";
import Backtotop from "@/shared/layout-components/backtotop/backtotop";
import Footer from "@/shared/layout-components/footer/footer";
import Header from "@/shared/layout-components/header/header";
import Sidebar from "@/shared/layout-components/sidebar/sidebar";
import { ThemeChanger } from "@/shared/redux/action";
import store from "@/shared/redux/store";
import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSession } from "next-auth/react";

// Create a context for the session
const SessionContext = createContext(null);

// Export the custom hook to use the session context
export const useSessionContext = () => useContext(SessionContext);

const Layout = ({ children }) => {
  const [MyclassName, setMyClass] = useState("");
  const { data: session, status } = useSession();

  const Bodyclickk = () => {
    const theme = store.getState();
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      if (theme.iconOverlay === "open") {
        ThemeChanger({ ...theme, iconOverlay: "" });
      }
    }
  };

  const [lateLoad, setlateLoad] = useState(false);
  const [newRequestPopupShow, setNewRequestPopupShow] = useState(false);

  useEffect(() => {
    setlateLoad(true);
  }, []);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  return (
    <SessionContext.Provider value={{ session, status }}>
      <Fragment>
        <div style={{ display: `${lateLoad ? "block" : "none"}` }}>
          <div className="page">
            <Header 
              setNewRequestPopupShow={setNewRequestPopupShow} 
              newRequestPopupShow={newRequestPopupShow} 
            />
            <Sidebar />
            <div className="content">
              <div className="main-content" onClick={Bodyclickk}>
                {children}
              </div>
            </div>
            <Footer />
          </div>
          <Backtotop />
          <PrelineScript />
        </div>
      </Fragment>
    </SessionContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Layout);