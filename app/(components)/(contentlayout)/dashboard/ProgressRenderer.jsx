import React from 'react';




export default (props) => {

  const { data, value } = props;

  const calcColor = (percentTime, percentTask) => {
    if (percentTask > percentTime) {
      return "text-[#64a30d]";  // Green
    } else if (percentTask < percentTime - 10) {
      return "text-red-500";    // Red
    } else {
      return "text-[#ffd300]";  // Yellow
    }
  };
  
  const calcLighterColor = (percentTime, percentTask) => {
    if (percentTask > percentTime) {
      return "text-[#9bd43b]";  // Lighter shade of green
    } else if (percentTask < percentTime - 10) {
      return "text-red-300";    // Lighter shade of red
    } else {
      return "text-[#ffe066]";  // Lighter shade of yellow
    }
  };
  
  

  const color = calcColor(value, data.percentComplete);
  const lighterColor = calcLighterColor(value, data.percentComplete);


  const outerShade = 400;
  const innerShade = 300;
  // Outer and inner circle radii
  const outerRadius = 18; // Outer circle radius
  const innerRadius = 16; // Inner circle radius

  // Circumference calculations
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  // Stroke-dashoffset calculations
  let innerOffset = innerCircumference * (1 - (data.percentComplete) / 100); // For outer circle
  let outerOffset = outerCircumference * (1 - value / 100); // For inner circle

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 py-0 -my-2">
      <div className="relative size-20">
        <svg className="size-full" width="55" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <g className="origin-center -rotate-90 transform">
          <circle
            cx="30"
            cy="30"
            r={outerRadius}
            fill="none"
            strokeWidth="8"
            strokeDasharray={outerCircumference} // Set outer circumference
            strokeDashoffset={outerOffset} // Set calculated offset
            className={`stroke-current ${color}`}
          ></circle>
          </g>

          {/* Inner background circle */}
          <circle
            cx="30"
            cy="30"
            r={innerRadius}
            fill="none"
            className="stroke-current text-gray-200 dark:text-white/10"
            strokeWidth="6"
          ></circle>

          {/* Inner colored circle */}
          <g className="origin-center -rotate-90 transform">
            <circle
              cx="30"
              cy="30"
              r={innerRadius}
              fill="none"
              strokeWidth="4"
              strokeDasharray={innerCircumference} // Set inner circumference
              strokeDashoffset={innerOffset} // Set calculated offset
              className={`stroke-current ${lighterColor}`}
            ></circle>
          </g>
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <span className="text-center text-[10px] font-bold text-gray-800 dark:text-white">{data.percentComplete}%</span>
        </div>
      </div>
    </div>
  );
};
