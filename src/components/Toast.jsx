import React from "react";
import { useEffect } from "react";

export default function Toast({ message, onClose }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast" role="alert">
            <span>{message}</span>
            <button onClick={onClose} aria-label="Close notification">
                ×
            </button>
        </div>
    );
}