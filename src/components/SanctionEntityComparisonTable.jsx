
import React from "react";
import "../styles/SanctionEntityComparisonTable.css";

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

export default function SanctionEntityComparisonTable({
    data = [],
}) {
    if (!data.length) {
        return (
            <></>
        );
    }

    return (
        <div className="entity-table-container">
            <div className="entity-table-header">
                <div>
                    <h2>Sanction Entity Comparison Results</h2>
                    <p>
                        Review entity names, address similarity,
                        and overall screening results.
                    </p>
                </div>

                <span className="entity-count">
                    {data.length} Records
                </span>
            </div>

            <div className="entity-table-scroll">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sanctioned Entity Name</th>
                            <th>Name Score</th>
                            <th>Address Score</th>
                            <th>Overall Score</th>
                            <th>Match Status</th>
                            <th>Score Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((entity, index) => {
                            const statusClass = getStatusClass(
                                entity.sanction_match_status
                            );

                            return (
                                <tr
                                    key={
                                        entity.sanctioned_entity_id ??
                                        `${entity.sanctioned_entity_name}-${index}`
                                    }
                                >
                                    <td>{index + 1}</td>

                                    <td>
                                        <strong className="entity-name">
                                            {entity.sanctioned_entity_name?.trim()}
                                        </strong>
                                    </td>

                                    <td>
                                        {formatScore(entity.name_score)}
                                    </td>

                                    <td>
                                        {formatScore(entity.address_score)}
                                    </td>

                                    <td>
                                        <div className="entity-overall-score">
                                            <strong>
                                                {entity.entity_compare_percentage ??
                                                    formatScore(entity.overall_score)}
                                            </strong>

                                            <div className="entity-score-track">
                                                <div
                                                    className={`entity-score-fill ${statusClass}`}
                                                    style={{
                                                        width: `${Math.max(
                                                            0,
                                                            Math.min(
                                                                100,
                                                                Number(entity.overall_score ?? 0) * 100
                                                            )
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={`entity-status-badge ${statusClass}`}
                                        >
                                            {entity.sanction_match_status
                                                ?.replaceAll("_", " ")}
                                        </span>
                                    </td>

                                    <td>
                                        <details className="entity-score-details">
                                            <summary>View scores</summary>

                                            <div className="entity-score-grid">
                                                <div>
                                                    <span>Name</span>
                                                    <strong>
                                                        {formatScore(entity.name_score)}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Address</span>
                                                    <strong>
                                                        {formatScore(entity.address_score)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </details>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
