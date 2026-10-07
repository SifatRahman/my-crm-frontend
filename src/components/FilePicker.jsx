import React from "react";
export default function FilePicker({
    label,
    accept,
    file,
    onChange,
    required = true,
}) {
    return (
        <div className="field">
            <label>
                {label}
                {required ? " *" : ""}
            </label>
            <input
                type="file"
                accept={accept}
                required={required}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
            />
            {file && (
                <div className="file-meta">
                    Selected: <strong>{file.name}</strong> ·{" "}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            )}
        </div>
    );
}
