import React from "react";
import '../styles/SanctionIndividualComparisonTable.css'
const scoreFields = [
    { key: "name_score", label: "Name" },
    { key: "date_of_birth_score", label: "DOB" },
    { key: "document_score", label: "Document" },
    { key: "nationality_score", label: "Nationality" },
    { key: "address_score", label: "Address" },
    { key: "place_of_birth_score", label: "Place of Birth" },
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
                    {data.length} Records
                </span>
            </div>

            <div className="sanction-table-scroll">
                <table className="sanction-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Sanctioned Person</th>
                            <th>Overall Score</th>
                            <th>Match Status</th>
                            <th>Timestamp</th>
                            <th>Score Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((person, index) => (
                            <tr key={person.id}>
                                <td>{index + 1}</td>

                                <td>
                                    <strong className="person-name">
                                        {person.individual_customer_name?.trim()}
                                    </strong>
                                </td>

                                <td>
                                    <span className="person-id">
                                        {person.top_match_sanctioned_person_name}
                                    </span>
                                </td>

                                <td>
                                    <div className="overall-score">
                                        <strong>
                                            {person.total_score
                                                ?? formatScore(person.total_score)}
                                        </strong>

                                        <div className="score-track">
                                            <div
                                                className={`score-fill ${getStatusClass(
                                                    person.match_status
                                                )}`}
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        Math.min(
                                                            100,
                                                            Number(person.total_score ?? 0) * 100
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
                                            person.match_status
                                        )}`}
                                    >
                                        {person.match_status
                                            ?.replaceAll("_", " ")}
                                    </span>
                                </td>
                                <td>
                                    <span className="person-id">
                                        {person.timestamp}
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