import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    FileCheck2,
    Search,
    Users,
    Building2,
    Activity,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
const cards = [
    [
        "CRM001",
        "Jaro-Winkler Test",
        "Test string similarity before using screening logic.",
        "/jaro",
        Activity,
    ],
    [
        "CRM003",
        "Import Sanctions",
        "Import UN XML and Bangladesh sanction PDF into the backend.",
        "/sanctions/import",
        FileCheck2,
    ],
    [
        "CRM004",
        "Individual Customer",
        "Create and save an individual customer for AML verification.",
        "/customers/individual/create",
        Users,
    ],
    [
        "CRM010",
        "Entity Customer",
        "Create and save an entity customer.",
        "/customers/entity/create",
        Building2,
    ],
    [
        "CRM006",
        "Individual Screening",
        "Compare customer data against sanctions and inspect scores.",
        "/screening/individual",
        Search,
    ],
    [
        "CRM012",
        "Entity Screening",
        "Run entity screening and review matching results.",
        "/screening/entity",
        Search,
    ],
];
export default function Dashboard() {
    return (
        <>
            <PageHeader
                code="AML / CRM"
                title="JB AML dashboard"
                description="Janata bank frontend for your Spring Boot sanctions and AML controllers."
            />
            <div className="stat-grid">
                <div className="stat">
                    <span>12</span>
                    <small>CRM endpoints mapped</small>
                </div>
                <div className="stat">
                    <span>04</span>
                    <small>File / import workflows</small>
                </div>
                <div className="stat">
                    <span>02</span>
                    <small>Customer types</small>
                </div>
                <div className="stat">
                    <span>02</span>
                    <small>Screening flows</small>
                </div>
            </div>
            <div className="card-grid">
                {cards.map(([code, title, desc, to, Icon]) => (
                    <Link className="feature-card" to={to} key={code}>
                        <div className="card-icon">
                            <Icon size={21} />
                        </div>
                        <div className="eyebrow">{code}</div>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <span className="card-link">
                            Open <ArrowRight size={15} />
                        </span>
                    </Link>
                ))}
            </div>
        </>
    );
}
