
import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { crmApi } from "../api/crmApi";
import "../styles/SanctionConfiguration.css";

const sections = [
    {
        title: "Date of Birth Matching Scores",
        description: "Configure how birth-year matches are scored.",
        fields: [
            {
                key: "only_exact_year_matched_dob_score",
                label: "Exact year matched",
                description: "DOB contains only the exact matching year",
            },
            {
                key: "year_in_between_given_two_year_matched_dob_score",
                label: "Year between two given years",
                description: "DOB year falls within a specified range",
            },
            {
                key: "only_year_matched_with_approximate_year_dob_score",
                label: "Approximate year matched",
                description: "DOB matches an approximate year",
            },
        ],
    },
    {
        title: "Individual Matching Weights",
        description: "Importance of each factor in individual screening.",
        fields: [
            {
                key: "after_score_individual_name_weight",
                label: "Name weight",
            },
            {
                key: "after_score_individual_dob_weight",
                label: "Date of birth weight",
            },
            {
                key: "after_score_individual_doc_weight",
                label: "Document weight",
            },
            {
                key: "after_score_individual_nationality_weight",
                label: "Nationality weight",
            },
            {
                key: "after_score_individual_address_weight",
                label: "Address weight",
            },
            {
                key: "after_score_individual_pob_weight",
                label: "Place of birth weight",
            },
        ],
    },
    {
        title: "Entity Matching Weights",
        description: "Importance of each factor in entity screening.",
        fields: [
            {
                key: "after_score_entity_name_weight",
                label: "Entity name weight",
            },
            {
                key: "after_score_entity_address_weight",
                label: "Entity address weight",
            },
        ],
    },
    {
        title: "Risk Classification Thresholds",
        description: "Minimum scores for each screening classification.",
        fields: [
            {
                key: "individual_high_risk_start_score",
                label: "Individual high-risk threshold",
            },
            {
                key: "individual_potential_match_start_score",
                label: "Individual potential-match threshold",
            },
            {
                key: "entity_high_risk_start_score",
                label: "Entity high-risk threshold",
            },
            {
                key: "entity_potential_match_start_score",
                label: "Entity potential-match threshold",
            },
        ],
    },
];

const initialConfig = Object.fromEntries(
    sections.flatMap((section) =>
        section.fields.map((field) => [field.key, ""])
    )
);

export default function SanctionConfiguration() {
    const [form, setForm] = useState(initialConfig);
    const [savedConfig, setSavedConfig] = useState(null);
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: (payload) =>
            crmApi.saveConfig(payload),

        onSuccess: (response, submittedPayload) => {
            // Use the backend response if it contains the saved configuration.
            // If the API returns an empty body, show the submitted values.
            const result =
                response && Object.keys(response).length > 0
                    ? response
                    : submittedPayload;
            console.log(result);

            setSavedConfig(result.data);
            setForm(
                Object.fromEntries(
                    Object.entries(result).map(([key, value]) => [
                        key,
                        String(value ?? ""),
                    ])
                )
            );
            setError("");
        },

        onError: (err) => {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save configuration."
            );
        },
    });

    const handleChange = (key, value) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));

        // Don't display an old saved table as though it
        // represents the unsaved edits.
        setSavedConfig(null);
        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {};

        for (const section of sections) {
            for (const field of section.fields) {
                const rawValue = form[field.key];

                if (
                    rawValue === "" ||
                    !Number.isFinite(Number(rawValue))
                ) {
                    setError(`${field.label} must be a valid number.`);
                    return;
                }

                const value = Number(rawValue);

                if (value < 0 || value > 100) {
                    setError(
                        `${field.label} must be between 0 and 100%.`
                    );
                    return;
                }

                payload[field.key] = value;
            }
        }

        mutation.mutate(payload);
    };

    return (
        <div className="sc-page">
            <header className="sc-header">
                <div>
                    <span className="sc-eyebrow">
                        AML / SANCTIONS
                    </span>
                    <h1>Screening Configuration</h1>
                </div>

                <div className="sc-header-icon">⚙</div>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="sc-sections">
                    {sections.map((section, index) => (
                        <section className="sc-card" key={section.title}>
                            <div className="sc-section-heading">
                                <span className="sc-section-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div>
                                    <h2>{section.title}</h2>
                                    <p>{section.description}</p>
                                </div>
                            </div>

                            <div className="sc-fields">
                                {section.fields.map((field) => (
                                    <label
                                        className="sc-field"
                                        key={field.key}
                                    >
                                        <span className="sc-label">
                                            {field.label}
                                        </span>

                                        {field.description && (
                                            <span className="sc-description">
                                                {field.description}
                                            </span>
                                        )}

                                        <div className="sc-input-wrap">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="any"
                                                required
                                                value={form[field.key]}
                                                onChange={(event) =>
                                                    handleChange(
                                                        field.key,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="e.g. 75"
                                            />
                                            <span className="sc-input-hint">
                                                %
                                            </span>
                                        </div>

                                        <span className="sc-raw-key">
                                            {field.key}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {error && (
                    <div className="sc-error" role="alert">
                        <strong>Unable to save:</strong> {error}
                    </div>
                )}

                {mutation.isSuccess && (
                    <div className="sc-success" role="status">
                        <span>✓</span>
                        Configuration saved successfully.
                    </div>
                )}

                <div className="sc-actions">
                    <button
                        type="button"
                        className="sc-reset"
                        onClick={() => {
                            setForm(initialConfig);
                            setSavedConfig(null);
                            setError("");
                            mutation.reset();
                        }}
                        disabled={mutation.isPending}
                    >
                        Reset form
                    </button>

                    <button
                        type="submit"
                        className="sc-save"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending
                            ? "Saving configuration..."
                            : "Save Configuration"}
                    </button>
                </div>
            </form>

            {savedConfig && (
                <section className="sc-saved-card">
                    <div className="sc-saved-heading">
                        <div>
                            <span className="sc-eyebrow">
                                SAVE CONFIRMED
                            </span>
                            <h2>Saved Configuration</h2>
                            <p>
                                The server accepted the configuration.
                            </p>
                        </div>

                        <span className="sc-saved-badge">
                            ✓ Saved
                        </span>
                    </div>

                    {sections.map((section) => (
                        <div
                            className="sc-table-section"
                            key={section.title}
                        >
                            <h3>{section.title}</h3>

                            <div className="sc-table-scroll">
                                <table className="sc-table">
                                    <thead>
                                        <tr>
                                            <th>Setting</th>
                                            <th className="sc-value-cell">
                                                Saved value
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {section.fields.map((field) => (
                                            <tr key={field.key}>
                                                <td>{field.label}</td>
                                                <td className="sc-value-cell">
                                                    <strong>
                                                        {savedConfig[field.key]
                                                            ?? "—"}
                                                    </strong>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
