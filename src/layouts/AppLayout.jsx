import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    Activity,
    FileCheck2,
    FileUp,
    Gauge,
    GitCompareArrows,
    Settings,
    ShieldCheck,
    Users,
    Building2,
    Search,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "../config/api";
const groups = [
    ["Overview", [["/", "Dashboard", Gauge]]],
    [
        "Sanctions",
        [
            ["/jaro", "Jaro-Winkler Test", Activity],
            ["/sanctions/upload", "UN XML Preview", FileUp],
            ["/sanctions/import", "Import Sanctions", FileCheck2],
            ["/sanctions/bd-preview", "BD PDF Preview", FileUp],
            ["/configuration", "AML Configuration", Settings],
        ],
    ],
    [
        "Customers",
        [
            ["/customers/individual/create", "Create Individual", Users],
            ["/customers/entity/create", "Create Entity", Building2],
            [
                "/customers/individual/view",
                "View / Verify Individual",
                ShieldCheck,
            ],
            ["/customers/entity/view", "Verify Entity", ShieldCheck],
        ],
    ],
    [
        "Screening",
        [
            ["/screening/individual", "Individual Comparison", Search],
            ["/screening/entity", "Entity Comparison", GitCompareArrows],
        ],
    ],
    [
        "History watch",
        [
            ["/history/individual", "Individual History", Search],
            ["/history/entity", "Entity History", GitCompareArrows],
        ],
    ]
];
export default function AppLayout() {
    const [open, setOpen] = useState(false);
    return (
        <div className="app-shell">
            <aside className={`sidebar ${open ? "open" : ""}`}>
                <div className="brand">
                    <div className="brand-mark">JB</div>
                    <div>
                        <strong>{APP_NAME}</strong>
                        <span>JB AML platform</span>
                    </div>
                    <button
                        className="mobile-close"
                        onClick={() => setOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav>
                    {groups.map(([g, items]) => (
                        <div className="nav-group" key={g}>
                            <div className="nav-label">{g}</div>
                            {items.map(([to, label, Icon]) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={to === "/"}
                                    onClick={() => setOpen(false)}
                                >
                                    <Icon size={17} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    CRM API
                    <br />
                    <span>
                        {import.meta.env.VITE_API_BASE_URL ||
                            "http://192.168.0.113:8080/api"}
                    </span>
                </div>
            </aside>
            <main className="main">
                <header className="topbar">
                    <button
                        className="menu-button"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={22} />
                    </button>
                    <div className="topbar-title">JB AML Sanctions Management</div>
                    <div className="status-dot">
                        <span /> API client ready
                    </div>
                </header>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
