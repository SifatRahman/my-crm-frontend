import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import FilePicker from "../components/FilePicker";
import ResultPanel from "../components/ResultPanel";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { crmApi } from "../api/crmApi";
import { getApiError } from "../api/http";
function SingleUpload({
    code,
    title,
    description,
    accept,
    action,
    fieldLabel,
}) {
    const [file, setFile] = useState(null),
        [error, setError] = useState("");
    const m = useMutation({
        mutationFn: () => action(file),
        onError: (e) => setError(getApiError(e)),
    });
    return (
        <>
            <PageHeader code={code} title={title} description={description} />
            <Toast message={error} onClose={() => setError("")} />
            <div className="panel">
                <FilePicker
                    label={fieldLabel}
                    accept={accept}
                    file={file}
                    onChange={setFile}
                />
                <button
                    className="btn primary"
                    disabled={!file || m.isPending}
                    onClick={() => m.mutate()}
                >
                    {m.isPending ? (
                        <Spinner label="Processing..." />
                    ) : (
                        "Upload and preview"
                    )}
                </button>
            </div>
            <ResultPanel data={m.data} title="Parsed response" />
        </>
    );
}
export const UnXmlPreviewPage = () => (
    <SingleUpload
        code="CRM002"
        title="UN sanctions XML preview"
        description="Upload an XML file and inspect the parsed DTO without saving it."
        accept=".xml,text/xml"
        action={crmApi.uploadUnXml}
        fieldLabel="UN sanctions XML"
    />
);
export const BdPdfPreviewPage = () => (
    <SingleUpload
        code="CRM009"
        title="Bangladesh sanctions PDF preview"
        description="Extract and inspect parsed domestic sanction records."
        accept=".pdf,application/pdf"
        action={crmApi.uploadBdPdf}
        fieldLabel="Bangladesh sanctions PDF"
    />
);
export function ImportSanctionsPage() {
    const [xml, setXml] = useState(null),
        [pdf, setPdf] = useState(null),
        [error, setError] = useState("");
    const m = useMutation({
        mutationFn: () => crmApi.saveSanctionData(xml, pdf),
        onError: (e) => setError(getApiError(e)),
    });
    return (
        <>
            <PageHeader
                code="CRM003"
                title="Import sanction data"
                description="Upload both sources and persist the parsed sanction datasets."
            />
            <Toast message={error} onClose={() => setError("")} />
            <div className="panel">
                <div className="form-grid two">
                    <FilePicker
                        label="UN sanctions XML"
                        accept=".xml,text/xml"
                        file={xml}
                        onChange={setXml}
                    />
                    <FilePicker
                        label="Bangladesh sanctions PDF"
                        accept=".pdf,application/pdf"
                        file={pdf}
                        onChange={setPdf}
                    />
                </div>
                <div className="warning">
                    This operation writes sanction data to the database. Confirm
                    the files before submitting.
                </div>
                <button
                    className="btn primary"
                    disabled={!xml || !pdf || m.isPending}
                    onClick={() => m.mutate()}
                >
                    {m.isPending ? (
                        <Spinner label="Importing..." />
                    ) : (
                        "Save sanction data"
                    )}
                </button>
            </div>
            <ResultPanel data={m.data} title="Import response" />
        </>
    );
}
