"use client"; // Mark this as a client component

import React, { useState, useEffect } from 'react';
import { fetchRequests } from '@/shared/actions';

const RequestsTable = () => {
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    async function getRequests() {
      const requests = await fetchRequests(); // Call the server action
      setRowData(requests);
    }

    getRequests();
  }, []);

  if (!rowData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <pre>{JSON.stringify(rowData, null, 2)}</pre>
    </div>
  );
};

export default RequestsTable;
