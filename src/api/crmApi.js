import { http } from "./http";
const u = (r) => r.data;
export const crmApi = {
    testJaro: (a, b) =>
        http
            .get(`/test/${encodeURIComponent(a)}/${encodeURIComponent(b)}`)
            .then(u),
    uploadUnXml: (f) => {
        const x = new FormData();
        x.append("file", f);
        return http
            .post("/upload/sanction/xml-file", x, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(u);
    },
    saveSanctionData: (xml, pdf) => {
        const x = new FormData();
        x.append("UNSanctionXML", xml);
        x.append("BDSanctionPDF", pdf);
        return http
            .post("/save/sanction-data", x, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 180000,
            })
            .then(u);
    },
    createIndividualCustomer: (b) =>
        http.post("/create/individual-customer",  b ).then(u),
    getIndividualCustomer: (id) =>
        http.get(`/view/${encodeURIComponent(id)}/individual-customer`).then(u),
    compareIndividual: (b) =>
        http.post("/compare/individual/sanction-data", b).then(u),
    verifyIndividual: (id) =>
        http
            .get(
                `/verify/aml/${encodeURIComponent(id)}/saved/individual-customer`,
            )
            .then(u),
    saveConfig: (b) =>
        http.post("/save/configuration/sanction-data", b).then(u),
    uploadBdPdf: (f) => {
        const x = new FormData();
        x.append("file", f);
        return http
            .post("/upload/bd-sanction/pdf-file", x, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 120000,
            })
            .then(u);
    },
    createEntityCustomer: (b) =>
        http.post("/create/entity-customer", b).then(u),
    verifyEntity: (id) =>
        http
            .get(`/verify/aml/${encodeURIComponent(id)}/saved/entity-customer`)
            .then(u),
    compareEntity: (b) => http.post("/compare/entity/sanction-data", b).then(u),

       getHistoryOfIndividual : (id) =>
        http
            .get(`/view/individual/${encodeURIComponent(id)}/history`)
            .then(u),

        getHistoryOfEntity: (id) =>
        http
            .get(`/view/entity/${encodeURIComponent(id)}/history`)
            .then(u),
};
