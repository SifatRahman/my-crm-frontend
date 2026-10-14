import React from "react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "./PageHeader";
import JsonEditor from "./JsonEditor";
import ResultPanel from "./ResultPanel";
import Spinner from "./Spinner";
import Toast from "./Toast";
import { getApiError } from "../api/http";
import "../styles/MutationFormPage.css";


export default function FormMutationPage({
    code,
    title,
    description,
    initialValue,
    action,
    successLabel,
}) {
    function cloneValue(value) {
        return structuredClone(value);
    }

    const [formData, setFormData] = useState(() => cloneValue(initialValue));
    const [error, setError] = useState("");

    useEffect(() => {
        setFormData(cloneValue(initialValue));
    }, [initialValue]);

    const mutation = useMutation({
        mutationFn: () => action(formData),

        onSuccess: () => {
            setError("");
        },

        onError: (e) => {
            setError(getApiError(e));
        },
    });

    function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function setNestedValue(target, path, value) {
        const nextValue = structuredClone(target);
        let current = nextValue;

        for (let index = 0; index < path.length - 1; index += 1) {
            const key = path[index];
            const nextKeyValue = current[key];

            if (nextKeyValue === null || typeof nextKeyValue !== "object") {
                current[key] = {};
            }

            current = current[key];
        }

        current[path[path.length - 1]] = value;
        return nextValue;
    }

    function getFieldLabel(key) {
        const lastKey = key.split(".").at(-1);

        if (lastKey === "entityCustomerPermanentAddressDTO" || lastKey === "EntityCustomerPermanentAddressDTO") {
            return "Customer Permanent Address";
        }

        const label = lastKey
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        const requiredFields = [
            "full_name",
            "customer_status",
            "nationality",
            "nid_no",
            "date_of_birth",
        ];

        const isRequired = requiredFields.includes(lastKey);

        return isRequired ? `${label} *` : label;
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        if (event.target.dataset.jsonField === "true") {
            setFormData((previous) => {
                const path = name.split(".");
                const currentValue = value.trim();

                if (!currentValue) {
                    return setNestedValue(previous, path, null);
                }

                try {
                    return setNestedValue(previous, path, JSON.parse(currentValue));
                } catch {
                    return setNestedValue(previous, path, value);
                }
            });
            return;
        }

        setFormData((previous) => {
            const path = name.split(".");
            const fieldName = path[path.length - 1];
            const nextValueRaw =
                type === "checkbox"
                    ? checked
                    : type === "number"
                      ? value === ""
                          ? ""
                          : Number(value)
                      : value;

            const nextValue =
                fieldName === "house_or_flat_no"
                    ? nextValueRaw === "" ? null : String(nextValueRaw)
                    : nextValueRaw;

            return setNestedValue(previous, path, nextValue);
        });
    }

    function handleReset() {
        setFormData(() => {
            const emptyValue = cloneValue(initialValue);

            function clearNestedObject(obj) {
                if (!obj || typeof obj !== "object") {
                    return obj;
                }

                if (Array.isArray(obj)) {
                    return [];
                }

                return Object.fromEntries(
                    Object.entries(obj).map(([key, value]) => {
                        const shouldKeepNull =
                            key === "spouse" ||
                            key === "cb_sector_code" ||
                            key === "house_or_flat_no" ||
                            key === "district" ||
                            key === "upazila" ||
                            key === "police_station" ||
                            key === "post_code" ||
                            key === "village_or_area" ||
                            key === "road_or_block" ||
                            key === "mobile_no" ||
                            key === "phone_number_off_1" ||
                            key === "email_address";

                        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                            return [key, clearNestedObject(value)];
                        }

                        if (typeof value === "string") {
                            return [key, shouldKeepNull ? null : ""];
                        }

                        if (typeof value === "number") {
                            return [key, 0];
                        }

                        if (typeof value === "boolean") {
                            return [key, false];
                        }

                        if (Array.isArray(value)) {
                            return [key, []];
                        }

                        return [key, null];
                    })
                );
            }

            return clearNestedObject(emptyValue);
        });
        setError("");
    }

    function getInputValue(value) {
        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            return value;
        }

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        return JSON.stringify(value, null, 2);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        mutation.mutate();
    }

    function renderFormFields(data, parentKey = "") {
        if (!data || typeof data !== "object") {
            return null;
        }

        return Object.entries(data).map(([key, value]) => {
            const fieldKey = parentKey ? `${parentKey}.${key}` : key;

            if (isPlainObject(value)) {
                return (
                    <div className="form-field form-field-group" key={fieldKey}>
                        <div className="form-group-label">{getFieldLabel(fieldKey)}</div>
                        <div className="nested-form-grid">
                            {renderFormFields(value, fieldKey)}
                        </div>
                    </div>
                );
            }

            const isBoolean = typeof value === "boolean";
            const isNumber = typeof value === "number";
            const label = getFieldLabel(fieldKey);

            return (
                <div className="form-field" key={fieldKey}>
                    {isBoolean ? (
                        <label className="checkbox-field">
                            <input
                                type="checkbox"
                                name={fieldKey}
                                checked={value}
                                onChange={handleChange}
                            />
                            <span>{label}</span>
                        </label>
                    ) : (
                        <>
                            <label htmlFor={fieldKey}>{label}</label>
                            <input
                                id={fieldKey}
                                name={fieldKey}
                                type={isNumber ? "number" : "text"}
                                value={getInputValue(value)}
                                onChange={handleChange}
                                step={isNumber ? "any" : undefined}
                                className="form-input"
                                placeholder={`Enter ${label.toLowerCase()}`}
                            />
                        </>
                    )}
                </div>
            );
        });
    }

    return (
        <>
            <PageHeader
                code={code}
                title={title}
                description={description}
            />

            <Toast message={error} type="error" />

            <div className="panel form-panel mutation-form-page">
                <form
                    className="customer-form mutation-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-topbar">
                        <div>
                            <p className="form-kicker">Payload</p>
                            <h2 className="form-title">Mutation request</h2>
                        </div>
                        <span className="form-badge">
                            {mutation.isPending ? "Submitting" : "Ready"}
                        </span>
                    </div>

                    <div className="form-grid">
                        {renderFormFields(formData)}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={handleReset}
                            disabled={mutation.isPending}
                        >
                            Reset
                        </button>

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