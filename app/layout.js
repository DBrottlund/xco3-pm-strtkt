"use client";
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import { useState } from "react";
import { Initialload } from "@/shared/contextapi";
import PrelineScript from "./Prelinescript";
import { SessionProvider } from "next-auth/react";

const RootLayout = ({ children }) => {
  const [pageloading, setpageloading] = useState(false);

  return (
    <>
      <Provider store={store}>
        <SessionProvider>
          <Initialload.Provider value={{ pageloading, setpageloading }}>
            {children}
          </Initialload.Provider>
        </SessionProvider>
      </Provider>
      <PrelineScript />
    </>
  );
};

export default RootLayout;
