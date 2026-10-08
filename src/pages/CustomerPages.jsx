import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import JsonEditor from "../components/JsonEditor";
import ResultPanel from "../components/ResultPanel";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { crmApi } from "../api/crmApi";
import { getApiError } from "../api/http";
const individualExample = {
  "full_name": "Sifatur Rahman Sifat", 
  "full_name_2": "Sifat",
  "family_name": "Sifat",
  "short_name": "Sifat",
  "mnemonic": "sifat",
  "gender": "Male",
  "account_officer": 0,
  "sector": 0,
  "target": 0,
  "customer_status": 0,
  "industry": "IT",
  "language": 2,
  "residence": "BD",
  "date_of_birth": "1998-11-14", 
  "nationality": "Bangladeshi",  
  "nid_no": "6904059851",  
  "passport_no": "EE947317",
  "father_name": "Karim",
  "mother_name": "String",
  "marital_status": "Unmarried",
  "spouse": null,
  "cb_sector_code": null,
  "return_submission_date": "2026-09-28",
  "sms_alert_service": true,
  "individual_customer_permanent_address": {
    "country": "Bangladesh",  
    "division_or_state": "Khulna", 
    "district": "Khulna",  
    "upazila": "Phultala",  
    "police_station": "Khan jahan ali",  
    "post_code": "9205",  
    "village_or_area": "Gilatala",  
    "road_or_block": "50 road,gilata", 
    "house_or_flat_no": [  
      "50 No","2A"
    ],
    "mobile_no": "01986800766",
    "phone_number_off_1": "01986800766",
    "email_address": "shifaturrahman390@gmail.com"
  }
};
const entityExample = {
  "full_name": "AL-BASHAIR TRADING COMPANY, LTD",
  "account_officer": 0,
  "sector": 0,
  "target": 0,
  "customer_status": 0,
  "industry": "string",
  "language": 0,
  "residence": "string",
  "cb_sector_code": "string",
  "return_submission_date": "2026-10-02",
  "sms_alert_service": true,
  "entityCustomerPermanentAddressDTO": {
    "country": "",
    "division_or_state": "string",
    "district": "string",
    "upazila": "string",
    "police_station": "string",
    "post_code": "string",
    "village_or_area": "string",
    "road_or_block": "string",
    "house_or_flat_no": [
      "string"
    ],
    "mobile_no": "string",
    "phone_number_off_1": "string",
    "email_address": "string"
  }
};
const compareIndividualExample = {
  "basic_details": {
    "full_name": "RUBEN JR",
    "full_name_2": "",
    "family_name": "",
    "short_name": "",
    "mnemonic": "",
    "gender": "",
    "account_officer": 0,
    "sector": 0,
    "target": 0,
    "customer_status": 0,
    "industry": "",
    "language": 0,
    "residence": "",
    "date_of_birth": "1972-10-04",
    "nationality": "bd",
    "nid_no": "",
    "passport_no": "EE947317",
    "father_name": "",
    "mother_name": "",
    "marital_status": "",
    "spouse": "",
    "cb_sector_code": "",
    "return_submission_date": "2026-09-28",
    "sms_alert_service": true
  },
  "permanent_address": {
    "country": "Philippines",
    "division_or_state": "Sulu region",
    "district": "Philippines",
    "upazila": "",
    "police_station": "",
    "post_code": "",
    "village_or_area": "",
    "road_or_block": "",
    "house_or_flat_no": [
      ""
    ],
    "mobile_no": "",
    "phone_number_off_1": "",
    "email_address": ""
  }
};
const compareEntityExample = {
    "basic_details": {
        "full_name": "Shahadat Islam", 
        "account_officer": 0,
        "sector": 0,
        "target": 0,
        "customer_status": 0,
        "industry": "string",
        "language": 0,
        "residence": "string",
        "cb_sector_code": "string",
        "return_submission_date": "2026-10-02",
        "sms_alert_service": true
    },
    "permanent_address": {
        "country": "Dhaka.", 
        "division_or_state": "",
        "district": null,
        "upazila": null,
        "police_station": null,
        "post_code": null,
        "village_or_area": null,
        "road_or_block": "",
        "house_or_flat_no": [
            ""
        ],
        "mobile_no": "",
        "phone_number_off_1": "",
        "email_address": ""
    }
};
function JsonMutationPage({
    code,
    title,
    description,
    initialValue,
    action,
    successLabel,
}) {
    const [body, setBody] = useState(initialValue),
        [error, setError] = useState("");
    const m = useMutation({
        mutationFn: () => action(body),
        onError: (e) => setError(getApiError(e)),
    });
    return (
        <>
            <PageHeader code={code} title={title} description={description} />
            <Toast message={error} onClose={() => setError("")} />
            <div className="panel">
                <JsonEditor
                    value={body}
                    onChange={setBody}
                    hint="Starter fields only: replace them with the exact fields from your backend DTO."
                />
                <button
                    className="btn primary"
                    disabled={m.isPending}
                    onClick={() => m.mutate()}
                >
                    {m.isPending ? (
                        <Spinner label="Submitting..." />
                    ) : (
                        successLabel
                    )}
                </button>
            </div>
            <ResultPanel data={m.data} title="Backend response" />
        </>
    );
}
export const CreateIndividualPage = () => (
    <JsonMutationPage
        code="CRM004"
        title="Create individual customer"
        description="Create and save an individual customer."
        initialValue={individualExample}
        action={crmApi.createIndividualCustomer}
        successLabel="Create customer"
    />
);
export const CreateEntityPage = () => (
    <JsonMutationPage
        code="CRM010"
        title="Create entity customer"
        description="Create and save an entity customer."
        initialValue={entityExample}
        action={crmApi.createEntityCustomer}
        successLabel="Create entity"
    />
);
export const IndividualComparePage = () => (
    <JsonMutationPage
        code="CRM006"
        title="Individual sanction screening"
        description="Pass customer data and retrieve the backend match scores."
        initialValue={compareIndividualExample}
        action={crmApi.compareIndividual}
        successLabel="Run individual screening"
    />
);
export const EntityComparePage = () => (
    <JsonMutationPage
        code="CRM012"
        title="Entity sanction screening"
        description="Pass entity data and retrieve the backend match scores."
        initialValue={compareEntityExample}
        action={crmApi.compareEntity}
        successLabel="Run entity screening"
    />
);

function VerifyPage({ entity = false }) {
    const [id, setId] = useState(""),
        [error, setError] = useState("");
    const q = useQuery({
        queryKey: ["verify", entity, id],
        queryFn: () =>
            entity ? crmApi.verifyEntity(id) : crmApi.verifyIndividual(id),
        enabled: false,
    });
    const run = () => {
        if (!id.trim()) {
            setError("Customer ID is required");
            return;
        }
        setError("");
        q.refetch();
    };
    return (
        <>
            <PageHeader
                code={entity ? "CRM011" : "CRM007"}
                title={entity ? "Verify entity AML" : "Verify individual AML"}
                description="Load saved customer data and run the backend AML verification workflow."
            />
            <Toast
                message={error || (q.error && getApiError(q.error))}
                onClose={() => setError("")}
            />
            <div className="panel">
                <div className="field">
                    <label>
                        {entity ? "Entity" : "Individual"} customer ID
                    </label>
                    <input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter persisted customer ID"
                    />
                </div>
                <button
                    className="btn primary"
                    disabled={q.isFetching}
                    onClick={run}
                >
                    {q.isFetching ? (
                        <Spinner label="Verifying..." />
                    ) : (
                        "Verify AML"
                    )}
                </button>
            </div>
            <ResultPanel data={q.data} title="Verification result" />
        </>
    );
}
export const VerifyIndividualPage = () => <VerifyPage />;
export const VerifyEntityPage = () => <VerifyPage entity />;

function HistoryPage({ entity = false }) {
    const [id, setId] = useState(""),
        [error, setError] = useState("");
    const q = useQuery({
        queryKey: ["verify", entity, id],
        queryFn: () =>
            entity ? crmApi.getHistoryOfEntity(id) : crmApi.getHistoryOfIndividual(id),
        enabled: false,
    });
    const run = () => {
        if (!id.trim()) {
            setError("Customer ID is required");
            return;
        }
        setError("");
        q.refetch();
    };
    return (
        <>
            <PageHeader
                code={entity ? "CRM014" : "CRM013"}
                title={entity ? "AML History of Entity" : "AML History of individual"}
                description=" backend AML History workflow."
            />
            <Toast
                message={error || (q.error && getApiError(q.error))}
                onClose={() => setError("")}
            />
            <div className="panel">
                <div className="field">
                    <label>
                        {entity ? "Entity" : "Individual"} customer ID
                    </label>
                    <input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter persisted customer ID"
                    />
                </div>
                <button
                    className="btn primary"
                    disabled={q.isFetching}
                    onClick={run}
                >
                    {q.isFetching ? (
                        <Spinner label="Verifying..." />
                    ) : (
                        "Verify AML"
                    )}
                </button>
            </div>
            <ResultPanel data={q.data} title="Verification result" />
        </>
    );
}
export const IndividualHistoryPage = () => <HistoryPage />;
export const EntityHistoryPage = () => <HistoryPage entity />;
