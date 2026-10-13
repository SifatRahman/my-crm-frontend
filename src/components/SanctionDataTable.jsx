import React from "react";;
import "../styles/SanctionTable.css";

export default function SanctionTable({ data, title = "Response" }) {
    if (data === undefined) return null
    if (!data.length) {
        return <p className="empty-message">No data available.</p>;
    }

    return (
        <div className="table-container">
            <table className="sanction-table">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Name of Entity</th>
                        <th>Address of Entity</th>
                        <th>Date of Proscription</th>
                        <th>Comment</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr key={`${item.sl ?? "row"}-${index}`}>
                            <td>{item.sl ?? index + 1}</td>
                            <td>{item.nameOfEntity || "-"}</td>
                            <td>{item.addressOfEntity || "-"}</td>
                            <td>{item.dateOfProscription || "-"}</td>
                            <td>{item.comment || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}