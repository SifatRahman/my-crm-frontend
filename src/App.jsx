import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import JaroPage from "./pages/JaroPage";
import {
    UnXmlPreviewPage,
    ImportSanctionsPage,
    BdPdfPreviewPage,
} from "./pages/UploadPages";
import {
    CreateIndividualPage,
    CreateEntityPage,
    IndividualComparePage,
    EntityComparePage,
    VerifyIndividualPage,
    VerifyEntityPage,
} from "./pages/CustomerPages";
import ConfigPage from "./pages/ConfigPage";
const NotFound = () => (
    <div className="empty">
        <h2>Page not found</h2>
        <p>The requested CRM screen does not exist.</p>
    </div>
);
export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/jaro" element={<JaroPage />} />
                <Route
                    path="/sanctions/upload"
                    element={<UnXmlPreviewPage />}
                />
                <Route
                    path="/sanctions/import"
                    element={<ImportSanctionsPage />}
                />
                <Route
                    path="/sanctions/bd-preview"
                    element={<BdPdfPreviewPage />}
                />
                <Route
                    path="/customers/individual/create"
                    element={<CreateIndividualPage />}
                />
                <Route
                    path="/customers/entity/create"
                    element={<CreateEntityPage />}
                />
                <Route
                    path="/customers/individual/view"
                    element={<VerifyIndividualPage />}
                />
                <Route
                    path="/customers/entity/view"
                    element={<VerifyEntityPage />}
                />
                <Route
                    path="/screening/individual"
                    element={<IndividualComparePage />}
                />
                <Route
                    path="/screening/entity"
                    element={<EntityComparePage />}
                />
                <Route path="/configuration" element={<ConfigPage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
