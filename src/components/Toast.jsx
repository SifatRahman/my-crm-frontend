import React from "react";
export default function Toast({ message, onClose }) {
    if (!message) return null;
    return (
        <div className="toast" role="alert">
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
}
