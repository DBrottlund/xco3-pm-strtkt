import React from 'react';


export default (props) => {

//    detruct props
  const { data, value } = props;

   
    return (
      JSON.stringify(value)
    );
};