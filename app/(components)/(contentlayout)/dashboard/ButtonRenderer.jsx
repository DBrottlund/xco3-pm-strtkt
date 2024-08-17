import React from 'react';
import { Button } from 'rizzui'; 


export default (props) => {
    const data = props.data;
    const value = props.value;
    const text = props.text;
    const type = props.type;

    return (
       <Button variant={type}>{props.text}</Button>
    );
};