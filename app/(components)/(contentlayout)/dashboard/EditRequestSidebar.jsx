"use client"; // Mark this as a client component

import React, { useState, useEffect } from "react";

const RequestEditOverlay = ({ isVisible, setIsVisible, postData }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  // Populate form with postData when the component is shown and postData changes
  useEffect(() => {
    if (isVisible && postData) {
      setFormData({
        title: postData.title || "",
        content: postData.content || "",
        author: postData.author || "",
      });
    }
  }, [isVisible, postData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., update the post)
    console.log("Updated Post Data:", formData);
    setIsVisible(false); // Close the overlay after submitting
  };

  return (
    <div
      className={`${
        isVisible ? "animate-slide-in" : "animate-slide-out"
      } fixed top-0 right-0 h-full w-[500px] bg-white shadow-lg z-[999999] overflow-y-auto`}
    >
      <div className="m-2 p-8 bg-secondary/50">
        <div className="ti-offcanvas-header z-10 relative">
          <h5 className="ti-offcanvas-title !text-[1.25rem] mb-2">
            Edit Request
          </h5>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="ti-btn flex-shrink-0 p-0  transition-none text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white  dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
            data-hs-overlay="#hs-overlay-switcher"
          >
            <span className="sr-only">Close modal</span>
            <i className="ri-close-circle-line leading-none text-lg"></i>
          </button>
        </div>

<div className="mb-4">
  <label
    htmlFor="form-text"
    className="form-label !text-[.875rem] text-black"
  >
    Title
  </label>
  <input
    type="text"
    className="form-control"
    id="form-text"
    placeholder=""
  />
</div>


<div className="mb-4">
          <label
            htmlFor="form-text"
            className="form-label !text-[.875rem] text-black"
          >
            Assignee Type
          </label>
          <input
            type="text"
            className="form-control"
            id="form-text"
            placeholder=""
          />
        </div>


        <div className="mb-4">
          <label
            htmlFor="form-text"
            className="form-label !text-[.875rem] text-black"
          >
            Request Body
          </label>
          <input
            type="text"
            className="form-control"
            id="form-text"
            placeholder=""
          />
        </div>


        <div className="mb-4">
          <label
            htmlFor="form-text"
            className="form-label !text-[.875rem] text-black"
          >
            Request
          </label>
          <input
            type="text"
            className="form-control"
            id="form-text"
            placeholder=""
          />
        </div>


        <div className="mb-4">
          <label
            htmlFor="form-text"
            className="form-label !text-[.875rem] text-black"
          >
            Request
          </label>
          <input
            type="text"
            className="form-control"
            id="form-text"
            placeholder=""
          />
        </div>




        <div className="mb-2">
          <div className="flex rounded-sm">
            <span className="px-4 inline-flex items-center min-w-fit rounded-s-sm border-e-0 border-gray-200 bg-light text-sm text-gray-500 dark:bg-black/20 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50">
              <span className="flex">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-md"
                  defaultChecked
                />
                <label className="sr-only">Task</label>
              </span>
            </span>
            <input
              type="text"
              name="hs-input-with-add-on-url-checkbox"
              id="hs-input-with-add-on-url-checkbox"
              className="ti-form-input rounded-none pe-11 rounded-s-none focus:z-10"
              placeholder="Checkbox"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex rounded-sm">
            <span className="px-4 inline-flex items-center min-w-fit rounded-s-sm border-e-0 border-gray-200 bg-light text-sm text-gray-500 dark:bg-black/20 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50">
              <span className="flex">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-md"
                  defaultChecked
                />
                <label className="sr-only">Task</label>
              </span>
            </span>
            <input
              type="text"
              name="hs-input-with-add-on-url-checkbox"
              id="hs-input-with-add-on-url-checkbox"
              className="ti-form-input rounded-none pe-11 rounded-s-none focus:z-10"
              placeholder="Checkbox"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex rounded-sm">
            <span className="px-4 inline-flex items-center min-w-fit rounded-s-sm border-e-0 border-gray-200 bg-light text-sm text-gray-500 dark:bg-black/20 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50">
              <span className="flex">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-md"
                  defaultChecked
                />
                <label className="sr-only">Task</label>
              </span>
            </span>
            <input
              type="text"
              name="hs-input-with-add-on-url-checkbox"
              id="hs-input-with-add-on-url-checkbox"
              className="ti-form-input rounded-none pe-11 rounded-s-none focus:z-10"
              placeholder="Checkbox"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex rounded-sm">
            <span className="px-4 inline-flex items-center min-w-fit rounded-s-sm border-e-0 border-gray-200 bg-light text-sm text-gray-500 dark:bg-black/20 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50">
              <span className="flex">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-md"
                  defaultChecked
                />
                <label className="sr-only">Task</label>
              </span>
            </span>
            <input
              type="text"
              name="hs-input-with-add-on-url-checkbox"
              id="hs-input-with-add-on-url-checkbox"
              className="ti-form-input rounded-none pe-11 rounded-s-none focus:z-10"
              placeholder="Checkbox"
            />
          </div>
        </div>
        <div className="mb-2">

        <button
          onClick={() => alert("Updated!")}
          className="ti-btn ti-btn-primary-full"
          type="submit"
        >
          Submit
        </button>
        </div>

<pre className="mb-2">{JSON.stringify(postData?.id)}</pre>
      

      </div>
    </div>
  );
};

export default RequestEditOverlay;
