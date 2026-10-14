import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "./PageHeader";
import JsonEditor from "./JsonEditor";
import ResultPanel from "./ResultPanel";
import Spinner from "./Spinner";
import Toast from "./Toast";
import { getApiError } from "../api/http";



const individualExample = {
  full_name: "Sifatur Rahman Sifat",
  full_name_2: "Sifat",
  family_name: "Sifat",
  short_name: "Sifat",
  mnemonic: "sifat",
  gender: "Male",
  account_officer: 0,
  sector: 0,
  target: 0,
  customer_status: 0,
  industry: "IT",
  language: 2,
  residence: "BD",
  date_of_birth: "1998-11-14",
  nationality: "Bangladeshi",
  nid_no: "6904059851",
  passport_no: "EE947317",
  father_name: "Karim",
  mother_name: "String",
  marital_status: "Unmarried",
  spouse: null,
  cb_sector_code: null,
  return_submission_date: "2026-09-28",
  sms_alert_service: true,
  individual_customer_permanent_address: {
    country: "Bangladesh",
    division_or_state: "Khulna",
    district: "Khulna",
    upazila: "Phultala",
    police_station: "Khan jahan ali",
    post_code: "9205",
    village_or_area: "Gilatala",
    road_or_block: "50 road,gilata",
    house_or_flat_no: ["50 No", "2A"],
    mobile_no: "01986800766",
    phone_number_off_1: "01986800766",
    email_address: "shifaturrahman390@gmail.com",
  },
};
const entityExample = {
  full_name: "AL-BASHAIR TRADING COMPANY, LTD",
  account_officer: 0,
  sector: 0,
  target: 0,
  customer_status: 0,
  industry: "string",
  language: 0,
  residence: "string",
  cb_sector_code: "string",
  return_submission_date: "2026-10-02",
  sms_alert_service: true,
  entityCustomerPermanentAddressDTO: {
    country: "",
    division_or_state: "string",
    district: "string",
    upazila: "string",
    police_station: "string",
    post_code: "string",
    village_or_area: "string",
    road_or_block: "string",
    house_or_flat_no: ["string"],
    mobile_no: "string",
    phone_number_off_1: "string",
    email_address: "string",
  },
};
const compareIndividualExample = {
  basic_details: {
    full_name: "RUBEN JR",
    full_name_2: "",
    family_name: "",
    short_name: "",
    mnemonic: "",
    gender: "",
    account_officer: 0,
    sector: 0,
    target: 0,
    customer_status: 0,
    industry: "",
    language: 0,
    residence: "",
    date_of_birth: "1972-10-04",
    nationality: "bd",
    nid_no: "",
    passport_no: "EE947317",
    father_name: "",
    mother_name: "",
    marital_status: "",
    spouse: "",
    cb_sector_code: "",
    return_submission_date: "2026-09-28",
    sms_alert_service: true,
  },
  permanent_address: {
    country: "Philippines",
    division_or_state: "Sulu region",
    district: "Philippines",
    upazila: "",
    police_station: "",
    post_code: "",
    village_or_area: "",
    road_or_block: "",
    house_or_flat_no: [""],
    mobile_no: "",
    phone_number_off_1: "",
    email_address: "",
  },
};
const compareEntityExample = {
  basic_details: {
    full_name: "Shahadat Islam",
    account_officer: 0,
    sector: 0,
    target: 0,
    customer_status: 0,
    industry: "string",
    language: 0,
    residence: "string",
    cb_sector_code: "string",
    return_submission_date: "2026-10-02",
    sms_alert_service: true,
  },
  permanent_address: {
    country: "Dhaka.",
    division_or_state: "",
    district: null,
    upazila: null,
    police_station: null,
    post_code: null,
    village_or_area: null,
    road_or_block: "",
    house_or_flat_no: [""],
    mobile_no: "",
    phone_number_off_1: "",
    email_address: "",
  },
};

export default function MutationFormPage({
    code,
    title,
    description,
    initialValue,
    action,
    successLabel,
}) {
    const [formData, setFormData] = useState(initialValue);
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

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                      ? value === ""
                          ? ""
                          : Number(value)
                      : value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        mutation.mutate();
    }

    return (
        <>
            <PageHeader
                code={code}
                title={title}
                description={description}
            />

            <Toast message={error} type="error" />

            <div className="panel">
                <form
                    className="customer-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-grid">
                        {Object.entries(formData).map(([key, value]) => {
                            const isBoolean =
                                typeof value === "boolean";

                            const isNumber =
                                typeof value === "number";

                            const label = key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                );

                            return (
                                <div
                                    className="form-field"
                                    key={key}
                                >
                                    {isBoolean ? (
                                        <label className="checkbox-field">
                                            <input
                                                type="checkbox"
                                                name={key}
                                                checked={value}
                                                onChange={handleChange}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ) : (
                                        <>
                                            <label htmlFor={key}>
                                                {label}
                                            </label>

                                            <input
                                                id={key}
                                                name={key}
                                                type={
                                                    isNumber
                                                        ? "number"
                                                        : "text"
                                                }
                                                value={value ?? ""}
                                                onChange={handleChange}
                                                step={
                                                    isNumber
                                                        ? "any"
                                                        : undefined
                                                }
                                                className="form-input"
                                            />
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

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