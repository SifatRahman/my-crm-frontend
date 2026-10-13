import React, { useEffect, useState } from "react";
import "../styles/Toast.css"

export default function Toast({ message, type = "success" }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message || !visible) return null;

    return (
        <div
            className={`toast toast-${type}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
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