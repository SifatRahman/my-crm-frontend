import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "./PageHeader";
import JsonEditor from "./JsonEditor";
import ResultPanel from "./ResultPanel";
import Spinner from "./Spinner";
import Toast from "./Toast";
import { getApiError } from "../api/http";

function formatLabel(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function FormFields({ data, onChange, prefix = "" }) {
    return Object.entries(data).map(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;

        // Nested DTO object: recursively render its fields.
        if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        ) {
            return (
                <fieldset className="nested-form-section" key={path}>
                    <legend>{formatLabel(key)}</legend>

                    <div className="form-grid">
                        <FormFields
                            data={value}
                            prefix={path}
                            onChange={onChange}
                        />
                    </div>
                </fieldset>
            );
        }

        const isBoolean = typeof value === "boolean";
        const isNumber = typeof value === "number";

        return (
            <div className="form-field" key={path}>
                {isBoolean ? (
                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(event) =>
                                onChange(path, event.target.checked)
                            }
                        />

                        <span>{formatLabel(key)}</span>
                    </label>
                ) : (
                    <>
                        <label htmlFor={path}>
                            {formatLabel(key)}
                        </label>

                        <input
                            id={path}
                            name={path}
                            type={isNumber ? "number" : "text"}
                            value={value ?? ""}
                            step={isNumber ? "any" : undefined}
                            className="form-input"
                            onChange={(event) => {
                                const inputValue = event.target.value;

                                onChange(
                                    path,
                                    isNumber && inputValue !== ""
                                        ? Number(inputValue)
                                        : inputValue
                                );
                            }}
                        />
                    </>
                )}
            </div>
        );
    });
}

function updateNestedValue(object, path, value) {
    const keys = path.split(".");

    const result = { ...object };
    let current = result;
    let original = object;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        current[key] = { ...original[key] };

        current = current[key];
        original = original[key];
    }

    current[keys[keys.length - 1]] = value;

    return result;
}

export default function FormMutationPage({
    code,
    title,
    description,
    initialValue,
    action,
    successLabel,
}) {
    const [formData, setFormData] = useState(() =>
        structuredClone(initialValue)
    );

    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: () => action(formData),

        onSuccess: () => {
            setError("");
        },

        onError: (e) => {
            setError(getApiError(e));
        },
    });

    function handleChange(path, value) {
        setFormData((previous) =>
            updateNestedValue(previous, path, value)
        );
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        mutation.mutate();
    }

    // Separate primitive fields from nested DTO objects.
    const basicFields = Object.fromEntries(
        Object.entries(formData).filter(
            ([, value]) =>
                value === null ||
                typeof value !== "object" ||
                Array.isArray(value)
        )
    );

    const nestedObjects = Object.entries(formData).filter(
        ([, value]) =>
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
    );

    return (
        <>
            <PageHeader
                code={code}
                title={title}
                description={description}
            />

            <Toast message={error} type="error" />

            <div className="panel">
                <form onSubmit={handleSubmit} className="customer-form">
                    <section className="form-section">
                        <h3>Basic Information</h3>

                        <div className="form-grid">
                            <FormFields
                                data={basicFields}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {nestedObjects.map(([key, value]) => (
                        <section
                            className="form-section"
                            key={key}
                        >
                            <h3>{formatLabel(key)}</h3>

                            <div className="form-grid">
                                <FormFields
                                    data={{ [key]: value }}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>
                    ))}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn primary"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Spinner label="Submitting..." />
                            ) : (
                                successLabel
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Toast
                message={mutation.data?.message}
                type="success"
            />

            <ResultPanel data={mutation.data} />
        </>
    );
}