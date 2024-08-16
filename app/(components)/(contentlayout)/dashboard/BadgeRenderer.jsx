import React from 'react';

export default (props) => {
  const { value } = props;
  const mod = ''
  const badges = {
    Request: `primary${mod} text-white`,
    Viewed: `secondary${mod} text-white`,
    Assigned: `success${mod} text-white`,
    PastDue: `danger${mod} text-white`,
    Merged: `warning${mod} text-white`,
    Completed: `info${mod} text-white`
  };
  

  return (
      <span className={`badge !rounded-full me-2 my-1 bg-${badges[value]}`} >{value}</span>
  );
};
