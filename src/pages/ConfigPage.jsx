import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import JsonEditor from "../components/JsonEditor";
import ResultPanel from "../components/ResultPanel";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { crmApi } from "../api/crmApi";
import { getApiError } from "../api/http";
const example = {
  "only_exact_year_matched_dob_score": 0.75,
  "year_in_between_given_two_year_matched_dob_score": 0.6,
  "only_year_matched_with_approximate_year_dob_score": 0.4,

  "after_score_individual_name_weight": 0.4,
  "after_score_individual_dob_weight": 0.2,
  "after_score_individual_doc_weight": 0.15,
  "after_score_individual_nationality_weight": 0.1,
  "after_score_individual_address_weight": 0.1,
  "after_score_individual_pob_weight": 0.05,

  "after_score_entity_name_weight": 0.6,
  "after_score_entity_address_weight": 0.4,

  "individual_high_risk_start_score": 0.85,
  "individual_potential_match_start_score": 0.70,

  "entity_high_risk_start_score": 0.95,
  "entity_potential_match_start_score": 0.85
};
export default function ConfigPage() {
    const [body, setBody] = useState(example),
        [error, setError] = useState("");
    const m = useMutation({
        mutationFn: () => crmApi.saveConfig(body),
        onError: (e) => setError(getApiError(e)),
    });
    return (
        <>
            <PageHeader
                code="CRM008"
                title="AML sanction configuration"
                description="Update the scoring and threshold configuration used by the screening service."
            />
            <Toast message={error} onClose={() => setError("")} />
            <div className="panel">
                <JsonEditor
                    value={body}
                    onChange={setBody}
                    label="Configuration JSON"
                    hint="Use exact property names from CreateSanctionConfigDataDTO. Values are normally between 0 and 1."
                />
                <button
                    className="btn primary"
                    disabled={m.isPending}
                    onClick={() => m.mutate()}
                >
                    {m.isPending ? (
                        <Spinner label="Saving..." />
                    ) : (
                        "Save configuration"
                    )}
                </button>
            </div>
            <ResultPanel data={m.data} title="Configuration response" />
        </>
    );
}
