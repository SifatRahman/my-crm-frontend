import React from "react";
import { pretty } from "../utils/json";
export default function ResultPanel({ data, title = "Response" }) {
    if (data === undefined) return null;
    return (
        <section className="result-panel">
            <div className="section-title">{title}</div>
            <pre>{pretty(data)}</pre>
        </section>
    );
}
