import React from 'react';
import { FaClipboard, FaEye, FaUserCheck, FaExclamationCircle, FaCodeMerge, FaCheckCircle } from "react-icons/fa";

const icons = {
  Request: FaClipboard,
  Viewed: FaEye,
  Assigned: FaUserCheck,
  PastDue: FaExclamationCircle,
  Merged: FaCodeMerge,
  Completed: FaCheckCircle
};

const BadgeWithIcon = (props) => {
  const { value } = props;
  
  const badges = {
    Request: `primary`,
    Viewed: `secondary`,
    Assigned: `success`,
    PastDue: `danger`,
    Merged: `warning`,
    Completed: `info`
  };

  const IconComponent = icons[value];

  return (
    <span
      className={`py-2 h-5 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-${badges[value]}/10 bg-outline-${badges[value]} text-${badges[value]}/80 rounded-full`}
    >
      {IconComponent && <IconComponent className="flex-shrink-0 size-3" />} {/* Dynamically render the icon */}
      {value}
    </span>
  );
};

export default BadgeWithIcon;
