import React from 'react';
import { Button } from 'rizzui'; 


export default (props) => {
    const country = props.valueFormatted ? props.valueFormatted : props.value;
    const total = props.data.title;

    return (
       <Button variant="outline">{props.text}</Button>
    );
};