import React from 'react';

export default (props) => {
  const { value } = props;

  console.log(value);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 py-2">
      {value.map((item, index) => (
        <span
          className="badge !rounded-full bg-black text-white p-2 flex justify-center items-center"
          key={index}
        >
          {item}
        </span>
      ))}
    </div>
  );
};
