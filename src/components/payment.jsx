// Payment.js
import React from "react";
import { Zap, DollarSign, Globe, Lock, Code, Link, User } from 'lucide-react';

// Define the PaymentRequest interface structure (for clarity within the component)
const PaymentRequestFieldData = [
    {
        category: "Mandatory Parameters",
        icon: Zap,
        fields: [
            { name: "siteCode", type: "string", description: "Unique merchant site identifier.", required: true, example: "SITE001A" },
            { name: "countryCode", type: "string", description: "ISO 3166-1 alpha-2 code (ZA).", required: true, example: "ZA" },
            { name: "currencyCode", type: "string", description: "ISO 4217 code (ZAR).", required: true, example: "ZAR" },
            { name: "amount", type: "number<double>", description: "The transaction amount.", required: true, example: "150.20" },
            { name: "transactionReference", type: "string", description: "Merchant's unique transaction reference.", required: true, example: "INV-4523-JAN" },
            { name: "bankReference", type: "string", description: "Reference for merchant bank statement recon.", required: true, example: "PAY-8051" },
            { name: "isTest", type: "boolean", description: "Flag to execute in test mode (true/false).", required: true, example: "true" },
            { name: "hashCheck", type: "string", description: "SHA512 integrity check hash.", required: true, example: "a3b1c5..." },
        ],
    },
    {
        category: "Redirection and Notification Endpoints",
        icon: Link,
        fields: [
            { name: "successUrl", type: "string<uri>", description: "URL for successful payment redirect/post.", required: false },
            { name: "cancelUrl", type: "string<uri>", description: "URL for customer cancellation redirect/post.", required: false },
            { name: "errorUrl", type: "string<uri>", description: "URL for error redirect/post.", required: false },
            { name: "notifyUrl", type: "string<uri>", description: "URL for asynchronous transaction notification post.", required: false },
        ],
    },
    {
        category: "Customer and Bank Routing",
        icon: User,
        fields: [
            { name: "customer", type: "string", description: "Customer name or identifier.", required: false },
            { name: "selectedBankId", type: "string<uuid>", description: "Bank UUID to bypass bank selection screen.", required: false },
            { name: "customerIdentifier", type: "string", description: "SA ID number (Required for high-risk merchants).", required: false },
            { name: "customerCellphoneNumber", type: "string", description: "Cellphone number for faster login (Exclude from hash).", required: false },
            { name: "expiryDateUtc", type: "string", description: "Cutoff time for payment acceptance (yyyy-MM-dd HH:mm UTC).", required: false },
        ],
    },
    {
        category: "Supplementary and Variable Fields",
        icon: Code,
        fields: [
            { name: "allowVariableAmount", type: "boolean", description: "Allows user to change the amount.", required: false },
            { name: "variableAmountMin", type: "number<double>", description: "Minimum if variable amount is allowed.", required: false },
            { name: "variableAmountMax", type: "number<double>", description: "Maximum if variable amount is allowed.", required: false },
            { name: "optional1", type: "string", description: "Merchant-defined supplementary data field 1.", required: false },
            { name: "optional2", type: "string", description: "Merchant-defined supplementary data field 2.", required: false },
            // ... (optional3, optional4, optional5 omitted for brevity in display)
        ],
    },
];


const FieldRow = ({ name, type, description, required, example }) => (
    <div className={`p-4 ${required ? 'border-l-4 border-l-secondary' : 'border-l-4 border-l-base-300'} hover:bg-base-200 transition-colors duration-150`}>
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-primary">{name}</h3>
            <div className={`badge ${required ? 'badge-secondary' : 'badge-ghost text-base-content'} badge-md font-mono`}>
                {required ? 'REQUIRED' : 'Optional'}
            </div>
        </div>
        <p className="text-sm text-base-content my-1">{description}</p>
        <div className="flex flex-wrap gap-x-4 text-xs font-mono text-gray-500 mt-2">
            <span>**Type:** <span className="text-info">{type}</span></span>
            {example && <span>**Example:** <span className="text-accent">{example}</span></span>}
        </div>
    </div>
);

const Payment = () => {
    return (
        <div className="p-6 md:p-10 lg:p-16 bg-base-100 min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold text-primary mb-3">
                    <DollarSign className="inline-block w-8 h-8 mr-3 text-secondary" />
                    PaymentRequest API Interface
                </h1>
                <p className="text-xl text-base-content opacity-70">
                    Formal definition for initiating a secure payment transaction.
                </p>
                <div className="divider"></div>
            </header>

            <main className="space-y-8 max-w-5xl mx-auto">
                {PaymentRequestFieldData.map((section, index) => (
                    <div key={index} className="card bg-base-300 shadow-xl border border-primary/20">
                        <div className="card-body p-0">
                            <h2 className="card-title p-5 text-2xl font-bold bg-primary text-primary-content rounded-t-xl">
                                <section.icon className="w-6 h-6 mr-2" />
                                {section.category}
                            </h2>
                            <div className="space-y-0 divide-y divide-base-content/20">
                                {section.fields.map((field, fieldIndex) => (
                                    <FieldRow key={fieldIndex} {...field} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="alert alert-info shadow-lg mt-10">
                    <div>
                        <Lock className="w-6 h-6" />
                        <span>
                            **Security Note:** The `hashCheck` field is mandatory for securing the request payload. Refer to the official API documentation for the SHA512 hash generation algorithm.
                        </span>
                    </div>
                </div>
            </main>
            
            <footer className="text-center mt-12 pt-6 text-sm text-base-content/60 border-t border-base-300">
                Interface developed based on Ozow PaymentRequest API specifications.
            </footer>
        </div>
    );
};

export default Payment;