import React, { useState } from 'react';
import { Button } from 'rizzui'; // Adjust imports based on your UI library
import { FaLightbulb, FaEye, FaClipboard, FaExclamationTriangle, FaCodeBranch, FaCheck, FaTimes } from 'react-icons/fa'; // Import FaTimes for the cancel button

const statusColors = {
    request: '#FFA500',
    viewed: '#32CD32',
    assigned: '#FF6347',
    pastDue: '#DC143C',
    merged: '#1E90FF',
    completed: '#1E90FF'
};

const statuses = [
    { key: 'request', label: 'Request', icon: <FaLightbulb /> },
    { key: 'viewed', label: 'Viewed', icon: <FaEye /> },
    { key: 'assigned', label: 'Assigned', icon: <FaClipboard /> },
    { key: 'pastDue', label: 'Past Due', icon: <FaExclamationTriangle /> },
    { key: 'merged', label: 'Merged', icon: <FaCodeBranch /> },
    { key: 'completed', label: 'Completed', icon: <FaCheck /> },
];

function StatusBadge({ initialStatus, isDisabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(initialStatus);

    const buttonStyle = { 
        width: '120px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '10px', // Rectangle with rounded corners
        position: 'relative'  // To position the dropdown
    };

    const currentStatusObj = statuses.find(status => status.key === currentStatus);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleStatusChange = (status) => {
        setCurrentStatus(status.key);
        setIsOpen(false);
    };

    const buttonSize = 40; // Size of circular buttons
    const radius = 60; // Radius of the circular layout
    const totalItems = statuses.length + 1; // Include the X button in the count

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button 
                style={{ 
                    backgroundColor: '#FFF', 
                    color: statusColors[currentStatusObj.key], 
                    border: `2px solid ${statusColors[currentStatusObj.key]}`, 
                    ...buttonStyle 
                }}
                onClick={toggleDropdown}
                disabled={isOpen || isDisabled} // Disable button if the ring is open or another button is disabled
            >
                {React.cloneElement(currentStatusObj.icon, { style: { marginRight: '8px', color: statusColors[currentStatusObj.key] } })} 
                {currentStatusObj.label}
            </Button>
            {isOpen && (
                <div 
                    style={{ 
                        position: 'absolute', 
                        width: `${radius * 2}px`, 
                        height: `${radius * 2}px`, 
                        top: `-${radius + buttonSize / 2 - 40}px`, // Move down 40px
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        zIndex: '9999', 
                        backgroundColor: 'rgba(255, 255, 255, 0.75)', // 75% opacity white background
                        borderRadius: '50%' // Make the ring background circular
                    }}
                >
                    {statuses.map((status, index) => {
                        const angle = (index / totalItems) * 2 * Math.PI;
                        const x = radius + radius * Math.cos(angle) - buttonSize / 2;
                        const y = radius + radius * Math.sin(angle) - buttonSize / 2;
                        return (
                            <Button 
                                key={status.key} 
                                onClick={() => handleStatusChange(status)} 
                                style={{ 
                                    width: `${buttonSize}px`, 
                                    height: `${buttonSize}px`,
                                    padding: '5px', // Adjusted padding for smaller buttons
                                    backgroundColor: '#FFF', 
                                    color: statusColors[status.key], 
                                    border: `2px solid ${statusColors[status.key]}`, 
                                    borderRadius: '50%', // Circular buttons
                                    position: 'absolute',
                                    top: `${y}px`,
                                    left: `${x}px`,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxSizing: 'border-box', // Ensures padding does not affect width
                                    cursor: 'pointer'
                                }}
                                disabled={isOpen} // Disable the status buttons if the ring is open
                            >
                                {React.cloneElement(status.icon, { style: { color: statusColors[status.key] } })} 
                            </Button>
                        );
                    })}
                    {/* X Button */}
                    <Button 
                        onClick={() => setIsOpen(false)} // Close the ring without changing the status
                        style={{ 
                            width: `${buttonSize}px`, 
                            height: `${buttonSize}px`,
                            padding: '5px', 
                            backgroundColor: '#FFF', 
                            color: '#FF0000', // Red color for the X button
                            border: `2px solid #FF0000`, 
                            borderRadius: '50%', // Circular button
                            position: 'absolute',
                            top: `${radius - buttonSize / 2}px`, // Centered vertically in the ring
                            left: `${radius - buttonSize / 2}px`, // Centered horizontally in the ring
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxSizing: 'border-box', // Ensures padding does not affect width
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default StatusBadge;
