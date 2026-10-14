import React from "react";
import "../styles/SanctionIndividualComparisonTable.css";



const scoreFields = [
    { key: "name_score", label: "Name" },
    { key: "dob_score", label: "DOB" },
    { key: "doc_score", label: "Document" },
    { key: "address_score", label: "Address" },
    { key: "pob_score", label: "Place of Birth" },
    { key: "nationality_score", label: "Nationality" },
];

function formatScore(score) {
    return `${(Number(score ?? 0) * 100).toFixed(0)}%`;
}

function getStatusClass(status) {
    switch (status) {
        case "HIGH_POTENTIAL_MATCHED":
            return "high-match";
        case "POTENTIAL_MATCHED":
            return "potential-match";
        case "CLEAR":
            return "clear-match";
        default:
            return "unknown-match";
    }
}

export default function SanctionIndividualComparisonTable({
    data = [],
}) {
    if (!data.length) {
        return (
            // <div className="sanction-empty">
            // </div>
            <></>
        );
    }

    return (
        <div className="sanction-table-container">
            <div className="sanction-table-header">
                <div>
                    <h2>Sanction Comparison Results</h2>
                    <p>
                        Review individual matching scores and
                        overall sanction screening results.
                    </p>
                </div>

                <span className="sanction-count">
                    Top {data.length} Records
                </span>
            </div>

            <div className="sanction-table-scroll">
                <table className="sanction-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sanctioned Person</th>
                            <th>Individual ID</th>
                            <th>Overall Score</th>
                            <th>Match Status</th>
                            <th>Score Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((person, index) => (
                            <tr key={person.sanctioned_person_id}>
                                <td>{index + 1}</td>

                                <td>
                                    <strong className="person-name">
                                        {person.sanctioned_person_name?.trim()}
                                    </strong>
                                </td>

                                <td>
                                    <span className="person-id">
                                        {person.sanctioned_person_id}
                                    </span>
                                </td>

                                <td>
                                    <div className="overall-score">
                                        <strong>
                                            {person.individual_compare_percentage
                                                ?? formatScore(person.overall_score)}
                                        </strong>

                                        <div className="score-track">
                                            <div
                                                className={`score-fill ${getStatusClass(
                                                    person.sanction_match_status
                                                )}`}
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        Math.min(
                                                            100,
                                                            Number(person.overall_score ?? 0) * 100
                                                        )
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span
                                        className={`status-badge ${getStatusClass(
                                            person.sanction_match_status
                                        )}`}
                                    >
                                        {person.sanction_match_status
                                            ?.replaceAll("_", " ")}
                                    </span>
                                </td>

                                <td>
                                    <details className="score-details">
                                        <summary>View scores</summary>

                                        <div className="score-grid">
                                            {scoreFields.map((field) => (
                                                <div
                                                    className="score-item"
                                                    key={field.key}
                                                >
                                                    <span>{field.label}</span>
                                                    <strong>
                                                        {formatScore(
                                                            person[field.key]
                                                        )}
                                                    </strong>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}