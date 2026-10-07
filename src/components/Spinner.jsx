import React from "react";
export default function Spinner({ label = "Loading..." }) {
    return (
        <span className="spinner-wrap">
            <span className="spinner" />
            {label}
        </span>
    );
}
