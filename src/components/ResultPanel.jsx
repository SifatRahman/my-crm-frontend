import React from "react";
import { pretty } from "../utils/json";
import "../styles/MutationFormPage.css";

export default function ResultPanel({ data, title = "Response" }) {
    if (data === undefined) return null;
    return (
        <section className="result-panel mutation-form-page">
            <div className="section-title">{title}</div>
            <pre>{pretty(data)}</pre>
        </section>
    );
}
