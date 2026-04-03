import { useState } from "react";
import { X, CheckCircle2, ChevronRight, ChevronLeft, Building2, Palette, Package, Layers, UserPlus, FileCheck } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { NewInstitutionData } from "../types/domain";

interface AddInstitutionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Singapore",
  "Japan",
];

const ACADEMIC_SESSIONS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

export function AddInstitutionWizard({ isOpen, onClose }: AddInstitutionWizardProps) {
  const { createInstitution, plans, institutions } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<NewInstitutionData>>({
    type: "university",
    country: "United States",
    timezone: "America/New_York",
    academicSession: "2025-2026",
    planId: 2, // Default to Pro
    featuresEnabled: [],
    autoStructureEnabled: true,
    branding: {
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: "Basic Details", icon: Building2 },
    { id: 2, title: "Branding", icon: Palette },
    { id: 3, title: "Plan & Features", icon: Package },
    { id: 4, title: "Structure Setup", icon: Layers },
    { id: 5, title: "Admin Account", icon: UserPlus },
    { id: 6, title: "Review & Confirm", icon: FileCheck },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const normalizedName = formData.name?.toLowerCase() ?? "";

    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = "Institution name is required";
      } else if (institutions.some(i => i.name.toLowerCase() === normalizedName)) {
        newErrors.name = "Institution name must be unique";
      }
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.timezone) newErrors.timezone = "Timezone is required";
      if (!formData.academicSession) newErrors.academicSession = "Academic session is required";
    }

    if (step === 2) {
      if (formData.branding?.primaryColor) {
        // Simple hex color validation
        if (!/^#[0-9A-F]{6}$/i.test(formData.branding.primaryColor)) {
          newErrors.primaryColor = "Invalid color format (use #RRGGBB)";
        }
      }
    }

    if (step === 3) {
      if (!formData.planId) newErrors.planId = "Plan selection is required";
    }

    if (step === 5) {
      if (!formData.adminName?.trim()) newErrors.adminName = "Admin name is required";
      if (!formData.adminEmail?.trim()) {
        newErrors.adminEmail = "Admin email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
        newErrors.adminEmail = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(5) && validateStep(1)) {
      createInstitution(formData as NewInstitutionData);
      onClose();
      // Reset form
      setCurrentStep(1);
      setFormData({
        type: "university",
        country: "United States",
        timezone: "America/New_York",
        academicSession: "2025-2026",
        planId: 2,
        featuresEnabled: [],
        autoStructureEnabled: true,
        branding: {
          primaryColor: "#1e40af",
          secondaryColor: "#3b82f6",
        },
      });
    }
  };

  const updateFormData = (updates: Partial<NewInstitutionData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const selectedPlan = plans.find(p => p.id === formData.planId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={onClose}>
      <div 
        className="bg-white rounded border border-[#d8dce2] w-full max-w-4xl m-6 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8eaed]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1f2937]">Add New Institution</h2>
            <button onClick={onClose} className="text-[#6b7280] hover:text-[#1f2937] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? "bg-emerald-600 text-white" :
                      isActive ? "bg-[#1e40af] text-white" :
                      "bg-[#e8eaed] text-[#9ca3af]"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className={`text-[11px] mt-1.5 text-center ${
                      isActive ? "text-[#1e40af] font-medium" : "text-[#6b7280]"
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px flex-1 -mt-5 ${
                      isCompleted ? "bg-emerald-600" : "bg-[#e8eaed]"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Institution Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className={`w-full bg-white border rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:ring-1 ${
                    errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#d8dce2] focus:border-[#1e40af] focus:ring-[#1e40af]"
                  }`}
                  placeholder="e.g., Oxford University"
                />
                {errors.name && <p className="text-[12px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Institution Type <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["school", "college", "university"].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateFormData({ type: type as "school" | "college" | "university" })}
                      className={`px-4 py-3 border-2 rounded text-[13px] font-medium capitalize transition-colors ${
                        formData.type === type
                          ? "border-[#1e40af] bg-blue-50 text-[#1e40af]"
                          : "border-[#e8eaed] text-[#6b7280] hover:border-[#d8dce2]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                    Country/Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.country || ""}
                    onChange={(e) => updateFormData({ country: e.target.value })}
                    className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                    Timezone <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.timezone || ""}
                    onChange={(e) => updateFormData({ timezone: e.target.value })}
                    className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Default Academic Session <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.academicSession || ""}
                  onChange={(e) => updateFormData({ academicSession: e.target.value })}
                  className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                >
                  {ACADEMIC_SESSIONS.map((session) => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Branding */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.branding?.displayName || ""}
                  onChange={(e) => updateFormData({ 
                    branding: { ...formData.branding, displayName: e.target.value }
                  })}
                  className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                  placeholder="Leave blank to use institution name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                    Primary Brand Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.branding?.primaryColor || "#1e40af"}
                      onChange={(e) => updateFormData({ 
                        branding: { ...formData.branding, primaryColor: e.target.value }
                      })}
                      className="w-12 h-10 rounded border border-[#d8dce2] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding?.primaryColor || "#1e40af"}
                      onChange={(e) => updateFormData({ 
                        branding: { ...formData.branding, primaryColor: e.target.value }
                      })}
                      className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] font-mono"
                      placeholder="#1e40af"
                    />
                  </div>
                  {errors.primaryColor && <p className="text-[12px] text-red-600 mt-1">{errors.primaryColor}</p>}
                </div>

                <div>
                  <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                    Secondary Color (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.branding?.secondaryColor || "#3b82f6"}
                      onChange={(e) => updateFormData({ 
                        branding: { ...formData.branding, secondaryColor: e.target.value }
                      })}
                      className="w-12 h-10 rounded border border-[#d8dce2] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding?.secondaryColor || "#3b82f6"}
                      onChange={(e) => updateFormData({ 
                        branding: { ...formData.branding, secondaryColor: e.target.value }
                      })}
                      className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] font-mono"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-5 bg-[#fafbfc] border border-[#e8eaed] rounded">
                <div className="text-[12px] text-[#6b7280] mb-3">Branding Preview</div>
                <div 
                  className="p-4 rounded"
                  style={{ backgroundColor: formData.branding?.primaryColor || "#1e40af" }}
                >
                  <div className="text-white font-semibold mb-1">
                    {formData.branding?.displayName || formData.name || "Institution Name"}
                  </div>
                  <div className="text-white/80 text-[12px]">
                    {((formData.type?.charAt(0).toUpperCase() ?? "") + (formData.type?.slice(1) ?? "")).trim()}
                  </div>
                </div>
              </div>

              <div className="text-[12px] text-[#6b7280] italic">
                You can skip this step and use default branding. Branding can be customized later.
              </div>
            </div>
          )}

          {/* Step 3: Plan & Features */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-3">
                  Select Plan <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => updateFormData({ planId: plan.id, featuresEnabled: plan.features })}
                      className={`p-4 border-2 rounded text-left transition-colors ${
                        formData.planId === plan.id
                          ? "border-[#1e40af] bg-blue-50"
                          : "border-[#e8eaed] hover:border-[#d8dce2]"
                      }`}
                    >
                      <div className="text-[14px] text-[#1f2937] font-semibold mb-1">{plan.name}</div>
                      <div className="text-[20px] text-[#1e40af] font-semibold mb-2">
                        ${(plan.price / 100).toLocaleString()}<span className="text-[12px] text-[#6b7280]">/mo</span>
                      </div>
                      <div className="text-[11px] text-[#6b7280] space-y-0.5">
                        <div>• {plan.userLimit.toLocaleString()} users</div>
                        <div>• {plan.storageLimit} GB storage</div>
                        <div>• {plan.features.length} features</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlan && (
                <div className="p-4 bg-[#fafbfc] border border-[#e8eaed] rounded">
                  <div className="text-[13px] text-[#1f2937] font-medium mb-3">
                    Included Features ({selectedPlan.features.length})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPlan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[12px] text-[#6b7280] italic">
                Features can be modified after institution creation based on plan limits.
              </div>
            </div>
          )}

          {/* Step 4: Structure Setup */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-5 bg-[#fafbfc] border border-[#e8eaed] rounded">
                <div className="text-[14px] text-[#1f2937] font-semibold mb-2">
                  Auto-Create Academic Structure
                </div>
                <p className="text-[13px] text-[#6b7280] mb-4">
                  Automatically set up basic academic structure including streams, batches, and subjects. 
                  The institution admin can customize these later.
                </p>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateFormData({ autoStructureEnabled: true })}
                    className={`flex-1 px-4 py-3 border-2 rounded text-[13px] font-medium transition-colors ${
                      formData.autoStructureEnabled
                        ? "border-[#1e40af] bg-blue-50 text-[#1e40af]"
                        : "border-[#e8eaed] text-[#6b7280] hover:border-[#d8dce2]"
                    }`}
                  >
                    Yes, auto-create structure
                  </button>
                  <button
                    onClick={() => updateFormData({ autoStructureEnabled: false })}
                    className={`flex-1 px-4 py-3 border-2 rounded text-[13px] font-medium transition-colors ${
                      !formData.autoStructureEnabled
                        ? "border-[#1e40af] bg-blue-50 text-[#1e40af]"
                        : "border-[#e8eaed] text-[#6b7280] hover:border-[#d8dce2]"
                    }`}
                  >
                    No, let admin configure
                  </button>
                </div>
              </div>

              {formData.autoStructureEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-[13px] text-blue-900 font-medium mb-2">
                    The following will be auto-created:
                  </div>
                  <ul className="text-[12px] text-blue-700 space-y-1 list-disc list-inside">
                    <li>Sample academic streams (Science, Commerce, Arts)</li>
                    <li>Default batch structure</li>
                    <li>Core subject templates</li>
                    <li>Initial admin dashboard</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Admin Account */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                <div className="text-[13px] text-amber-900 font-medium mb-1">
                  Institution Admin Account
                </div>
                <p className="text-[12px] text-amber-700">
                  This user will have full administrative control over the institution. 
                  An invitation email will be sent with login credentials.
                </p>
              </div>

              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Admin Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.adminName || ""}
                  onChange={(e) => updateFormData({ adminName: e.target.value })}
                  className={`w-full bg-white border rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:ring-1 ${
                    errors.adminName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#d8dce2] focus:border-[#1e40af] focus:ring-[#1e40af]"
                  }`}
                  placeholder="e.g., John Smith"
                />
                {errors.adminName && <p className="text-[12px] text-red-600 mt-1">{errors.adminName}</p>}
              </div>

              <div>
                <label className="block text-[13px] text-[#1f2937] font-medium mb-1.5">
                  Admin Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={formData.adminEmail || ""}
                  onChange={(e) => updateFormData({ adminEmail: e.target.value })}
                  className={`w-full bg-white border rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:ring-1 ${
                    errors.adminEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#d8dce2] focus:border-[#1e40af] focus:ring-[#1e40af]"
                  }`}
                  placeholder="admin@institution.edu"
                />
                {errors.adminEmail && <p className="text-[12px] text-red-600 mt-1">{errors.adminEmail}</p>}
                <p className="text-[11px] text-[#6b7280] mt-1">
                  An invitation email will be sent to this address
                </p>
              </div>

              <div className="p-4 bg-[#fafbfc] border border-[#e8eaed] rounded">
                <div className="text-[12px] text-[#6b7280] mb-2">Post-creation actions:</div>
                <ul className="text-[12px] text-[#6b7280] space-y-1 list-disc list-inside">
                  <li>Admin account will be created with "Institution Admin" role</li>
                  <li>Temporary password will be generated</li>
                  <li>Invitation email sent with login link</li>
                  <li>Admin forced to reset password on first login</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 6: Review & Confirm */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded">
                <div className="text-[13px] text-emerald-900 font-medium mb-1">
                  Ready to Create Institution
                </div>
                <p className="text-[12px] text-emerald-700">
                  Review the details below and click "Create Institution" to proceed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#e8eaed] rounded">
                  <div className="text-[11px] text-[#6b7280] mb-2">BASIC DETAILS</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Name</div>
                      <div className="text-[13px] text-[#1f2937] font-medium">{formData.name}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Type</div>
                      <div className="text-[13px] text-[#1f2937] capitalize">{formData.type}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Location</div>
                      <div className="text-[13px] text-[#1f2937]">{formData.country}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Timezone</div>
                      <div className="text-[13px] text-[#1f2937]">{formData.timezone}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#e8eaed] rounded">
                  <div className="text-[11px] text-[#6b7280] mb-2">PLAN & FEATURES</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Plan</div>
                      <div className="text-[13px] text-[#1f2937] font-medium">{selectedPlan?.name}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Features</div>
                      <div className="text-[13px] text-[#1f2937]">{formData.featuresEnabled?.length || 0} enabled</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">User Limit</div>
                      <div className="text-[13px] text-[#1f2937]">{selectedPlan?.userLimit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Storage</div>
                      <div className="text-[13px] text-[#1f2937]">{selectedPlan?.storageLimit} GB</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#e8eaed] rounded">
                  <div className="text-[11px] text-[#6b7280] mb-2">BRANDING</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Display Name</div>
                      <div className="text-[13px] text-[#1f2937]">{formData.branding?.displayName || formData.name}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Primary Color</div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-[#e8eaed]"
                          style={{ backgroundColor: formData.branding?.primaryColor }}
                        />
                        <span className="text-[13px] text-[#1f2937] font-mono">{formData.branding?.primaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#e8eaed] rounded">
                  <div className="text-[11px] text-[#6b7280] mb-2">ADMIN ACCOUNT</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Name</div>
                      <div className="text-[13px] text-[#1f2937] font-medium">{formData.adminName}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Email</div>
                      <div className="text-[13px] text-[#1f2937]">{formData.adminEmail}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Role</div>
                      <div className="text-[13px] text-[#1f2937]">Institution Admin</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#fafbfc] border border-[#e8eaed] rounded">
                <div className="text-[12px] text-[#6b7280] mb-2">What happens next:</div>
                <ul className="text-[12px] text-[#6b7280] space-y-1 list-decimal list-inside">
                  <li>Institution will be created with unique ID</li>
                  <li>Admin account will be provisioned</li>
                  <li>Invitation email sent to {formData.adminEmail}</li>
                  <li>Institution marked as "Active" and visible in the system</li>
                  <li>All actions will be logged in audit trail</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#e8eaed] flex items-center justify-between bg-white">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] text-[#6b7280] hover:text-[#1f2937] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-[12px] text-[#6b7280]">
            Step {currentStep} of {steps.length}
          </div>

          <div>
            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e40af] rounded text-[13px] text-white hover:bg-[#1e3a8a] transition-colors font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 rounded text-[13px] text-white hover:bg-emerald-700 transition-colors font-medium"
              >
                Create Institution
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
