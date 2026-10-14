import React, { useState, useEffect } from 'react';

const INDIAN_STATES_CITIES = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur", "Ghaziabad", "Agra"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
    "Delhi": ["New Delhi", "Central Delhi", "South Delhi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"]
};

const EditOrganization = ({ organization, onCancel, onSaveSuccess }) => {
    const org = organization || {
        code: 10005,
        name: "HCL Technologies",
        website: "www.hcltech.com",
        pan: "EEEEE5678E",
        gst: "27EEEEE5678E1ZZ",
        state: "Uttar Pradesh",
        city: "Noida",
        pocName: "C Vijayakumar",
        pocPhone: "9876543214",
        pocEmail: "vijay@hcl.com",
        subscription: "Enterprise Standard"
    };

    const [companyName, setCompanyName] = useState(org.name || '');
    const [website, setWebsite] = useState(org.website || '');
    const [pan, setPan] = useState(org.pan || '');
    const [gst, setGst] = useState(org.gst || '');
    const [state, setState] = useState(org.state || 'Uttar Pradesh');
    const [city, setCity] = useState(org.city || 'Noida');

    // POC Fields
    const [pocName, setPocName] = useState(org.pocName || '');
    const [pocPhone, setPocPhone] = useState(org.pocPhone || '');
    const [pocEmail, setPocEmail] = useState(org.pocEmail || '');

    // Subscription
    const [subscriptionPlan, setSubscriptionPlan] = useState(org.subscription || 'Enterprise Standard');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (organization) {
            setCompanyName(organization.name || '');
            setWebsite(organization.website || '');
            setPan(organization.pan || '');
            setGst(organization.gst || '');
            setState(organization.state || 'Uttar Pradesh');
            setCity(organization.city || 'Noida');
            setPocName(organization.pocName || '');
            setPocPhone(organization.pocPhone || '');
            setPocEmail(organization.pocEmail || '');
            setSubscriptionPlan(organization.subscription || 'Enterprise Standard');
        }
    }, [organization]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            name: companyName,
            website,
            pan,
            gst,
            state,
            city,
            pocName,
            pocPhone,
            pocEmail,
            subscription: subscriptionPlan
        };

        try {
            await onSaveSuccess(org.id || `org-${org.code}`, updatedData);
        } finally {
            setLoading(false);
        }
    };

    const cities = INDIAN_STATES_CITIES[state] || ["Noida", "Mumbai", "Bengaluru", "New Delhi"];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb Header */}
            <div>
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                    <span className="cursor-pointer hover:text-slate-600" onClick={onCancel}>Home</span>
                    <span>/</span>
                    <span className="cursor-pointer hover:text-slate-600" onClick={onCancel}>Organization</span>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">{org.code || 10005}</span>
                </nav>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Edit Organization
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Edit and save the organization information here
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Company Information */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <h3 className="text-base font-bold text-slate-800">
                            Company Information
                        </h3>
                        <span className="text-xs font-bold text-[#0084ff] bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
                            Company Code : {org.code || 10005}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Company Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Company Name
                            </label>
                            <input
                                required
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter your company name"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 transition-colors"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Website
                            </label>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="www.example.com"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 transition-colors"
                            />
                        </div>

                        {/* PAN */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                PAN
                            </label>
                            <input
                                required
                                type="text"
                                value={pan}
                                onChange={(e) => setPan(e.target.value.toUpperCase())}
                                placeholder="PAN"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 uppercase transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* GST No. */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                GST No.
                            </label>
                            <input
                                required
                                type="text"
                                value={gst}
                                onChange={(e) => setGst(e.target.value.toUpperCase())}
                                placeholder="GSTIN"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 uppercase transition-colors"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                State
                            </label>
                            <select
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value);
                                    const availableCities = INDIAN_STATES_CITIES[e.target.value] || [];
                                    if (availableCities.length > 0) setCity(availableCities[0]);
                                }}
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 bg-white cursor-pointer transition-colors"
                            >
                                {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                City
                            </label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 bg-white cursor-pointer transition-colors"
                            >
                                {cities.map((ct) => (
                                    <option key={ct} value={ct}>{ct}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Point of Contact :: Administrator */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
                        Point of Contact :: Administrator
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Name
                            </label>
                            <input
                                required
                                type="text"
                                value={pocName}
                                onChange={(e) => setPocName(e.target.value)}
                                placeholder="Enter full name"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 transition-colors"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Phone
                            </label>
                            <input
                                required
                                type="tel"
                                value={pocPhone}
                                onChange={(e) => setPocPhone(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                value={pocEmail}
                                onChange={(e) => setPocEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Subscription */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
                        Subscription
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Plan Tier
                            </label>
                            <select
                                value={subscriptionPlan}
                                onChange={(e) => setSubscriptionPlan(e.target.value)}
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 bg-white cursor-pointer"
                            >
                                <option value="Enterprise Standard">Enterprise Standard (Up to 50 Users)</option>
                                <option value="Enterprise Plus">Enterprise Plus (Up to 250 Users)</option>
                                <option value="Enterprise Elite">Enterprise Elite (Unlimited Scale)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditOrganization;
