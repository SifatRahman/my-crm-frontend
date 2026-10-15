import React from "react";
import "../styles/CustomerCreatedResult.css";
import "../styles/MutationFormPage.css";

export default function CustomerCreatedResult({ data }) {
  if (!data) return null;

  const customerId = data.data;

  const copyId = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(customerId);
      } else {
        // Fallback for insecure contexts
        const textArea = document.createElement("textarea");

        textArea.value = customerId;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");

        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Clipboard copy failed");
        }
      }

      console.log("Customer ID copied successfully!");
    } catch (error) {
      console.error("Failed to copy customer ID:", error);
    }
  };

  return (
    <section className="customer-result">
      <div className="customer-result__header">
        <span className="customer-result__icon">✓</span>

        <div>
          <h3>{data.message || "Customer created"}</h3>
          <span className="customer-result__status">
            {data.status || "success"}
          </span>
        </div>
      </div>

      <div className="customer-result__body">
        <label>Customer ID</label>

        <div className="customer-result__id-row">
          <code>{customerId || "Not available"}</code>

          {customerId && (
            <button
              type="button"
              onClick={copyId}
              className="customer-result__copy"
            >
              Copy ID
            </button>
          )}
        </div>

        {data.timestamp && (
          <div className="customer-result__timestamp">
            <span>Created at</span>
            <span>{new Date(data.timestamp).toLocaleString()}</span>
          </div>
        )}
      </div>
    </section>
  );
}
