import React, { useEffect, useState, useRef } from "react";
import "../styles/Toast.css"

export default function Toast({ message, type = "success" }) {
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        setIsHovered(false);

        // Clear any previous timer.
        clearTimeout(timerRef.current);

        // Start the 3-second timer.
        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [message]);

    // Pause the timer while hovering.
    useEffect(() => {
        if (!visible || !isHovered) {
            return;
        }

        clearTimeout(timerRef.current);
    }, [visible, isHovered]);

    // Resume the timer when the cursor leaves.
    function handleMouseLeave() {
        setIsHovered(false);

        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, 3000);
    }

    if (!message || !visible) {
        return null;
    }

    return (
        <div
            className={`toast toast-${type}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <span>{message}</span>
        </div>
    );
}

/*

<Toast message="Data saved successfully!" type="success" />

<Toast message="Failed to save data!" type="error" />

<Toast message="Please check your input." type="warning" />

<Toast message="Processing your request..." type="info" />
*/