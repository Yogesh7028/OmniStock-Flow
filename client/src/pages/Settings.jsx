import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import SectionHeader from "../components/common/SectionHeader";
import settingsService from "../services/settingsService";
import { useAuth } from "../context/AuthContext";

const sectionMeta = {
  account: { label: "Account", description: "Profile, password, and OTP preferences." },
  notifications: { label: "Notifications", description: "Email, SMS, and operational alert preferences." },
  appearance: { label: "Appearance", description: "Theme and display preferences." },
  organization: { label: "Organization", description: "Company identity, GST, and logo settings." },
  rolePermissions: { label: "Roles", description: "Role-based permission groups." },
  inventory: { label: "Inventory", description: "Stock limits and alert behavior." },
  payment: { label: "Payments", description: "Razorpay and accepted payment methods." },
  invoice: { label: "Invoices", description: "GST, invoice prefix, logo, and footer notes." },
  security: { label: "Security", description: "Session timeout and login activity settings." },
  integration: { label: "Integrations", description: "SMTP, Cloudinary, and Razorpay integration references." },
  data: { label: "Data", description: "CSV export and import preferences." },
};

const permissionOptions = [
  "users",
  "products",
  "warehouses",
  "stock",
  "transfers",
  "orders",
  "payments",
  "invoices",
  "reports",
  "settings",
  "checkout",
  "deliveryStatus",
];

const roleLabels = {
  ADMIN: "Admin",
  WAREHOUSE_MANAGER: "Warehouse Manager",
  STORE_MANAGER: "Customer / Store Owner",
  SUPPLIER: "Supplier",
};

const BooleanField = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      type="checkbox"
      className="h-5 w-5 accent-teal-700"
      checked={Boolean(checked)}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <select
      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-teal-600"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

function Settings() {
  const { user, refreshMe } = useAuth();
  const [sections, setSections] = useState({});
  const [allowedSections, setAllowedSections] = useState([]);
  const [activeSection, setActiveSection] = useState("account");
  const [accountForm, setAccountForm] = useState({});
  const [saving, setSaving] = useState(false);

  const activeMeta = sectionMeta[activeSection] || sectionMeta.account;
  const visibleSections = useMemo(
    () => allowedSections.filter((section) => sectionMeta[section]),
    [allowedSections]
  );

  useEffect(() => {
    const loadSettings = async () => {
      const response = await settingsService.getAll();
      const data = response.data.data;
      setSections(data.sections || {});
      setAllowedSections(data.allowedSections || []);
      setActiveSection((current) => (data.allowedSections?.includes(current) ? current : data.allowedSections?.[0] || "account"));
      setAccountForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        storeName: data.user?.storeName || "",
        otpEnabled: data.sections?.account?.otpEnabled ?? true,
        currentPassword: "",
        newPassword: "",
      });
    };

    loadSettings().catch((error) => toast.error(error.message || "Unable to load settings"));
  }, []);

  const updateSectionState = (section, key, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const saveSection = async (section) => {
    setSaving(true);
    try {
      if (section === "account") {
        await settingsService.updateAccount(accountForm);
        await refreshMe();
        setAccountForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      } else {
        const response = await settingsService.updateSection(section, sections[section] || {});
        setSections((prev) => ({ ...prev, [section]: response.data.data.settings }));
      }
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (role, permission) => {
    const current = sections.rolePermissions?.[role] || [];
    const next = current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission];

    setSections((prev) => ({
      ...prev,
      rolePermissions: {
        ...(prev.rolePermissions || {}),
        [role]: next,
      },
    }));
  };

  const renderSection = () => {
    const data = sections[activeSection] || {};

    if (activeSection === "account") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={accountForm.name || ""} onChange={(event) => setAccountForm({ ...accountForm, name: event.target.value })} />
          <Input label="Email" value={accountForm.email || ""} disabled />
          <Input label="Phone" value={accountForm.phone || ""} onChange={(event) => setAccountForm({ ...accountForm, phone: event.target.value })} />
          <Input label="Store / Organization Name" value={accountForm.storeName || ""} onChange={(event) => setAccountForm({ ...accountForm, storeName: event.target.value })} />
          <Input label="Current Password" type="password" value={accountForm.currentPassword || ""} onChange={(event) => setAccountForm({ ...accountForm, currentPassword: event.target.value })} />
          <Input label="New Password" type="password" value={accountForm.newPassword || ""} onChange={(event) => setAccountForm({ ...accountForm, newPassword: event.target.value })} />
          <div className="md:col-span-2">
            <BooleanField label="OTP enabled" checked={accountForm.otpEnabled} onChange={(value) => setAccountForm({ ...accountForm, otpEnabled: value })} />
          </div>
        </div>
      );
    }

    if (activeSection === "notifications") {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <BooleanField label="Email notifications" checked={data.email} onChange={(value) => updateSectionState("notifications", "email", value)} />
          <BooleanField label="SMS notifications" checked={data.sms} onChange={(value) => updateSectionState("notifications", "sms", value)} />
          <BooleanField label="Low stock alerts" checked={data.lowStockAlerts} onChange={(value) => updateSectionState("notifications", "lowStockAlerts", value)} />
          <BooleanField label="Order alerts" checked={data.orderAlerts} onChange={(value) => updateSectionState("notifications", "orderAlerts", value)} />
          <BooleanField label="Payment alerts" checked={data.paymentAlerts} onChange={(value) => updateSectionState("notifications", "paymentAlerts", value)} />
        </div>
      );
    }

    if (activeSection === "appearance") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <BooleanField label="Dark mode" checked={data.darkMode} onChange={(value) => updateSectionState("appearance", "darkMode", value)} />
          <SelectField label="Theme" value={data.theme} onChange={(value) => updateSectionState("appearance", "theme", value)} options={[{ value: "teal", label: "Teal" }, { value: "blue", label: "Blue" }, { value: "slate", label: "Slate" }]} />
          <SelectField label="Density" value={data.density} onChange={(value) => updateSectionState("appearance", "density", value)} options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} />
        </div>
      );
    }

    if (activeSection === "organization") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Company Name" value={data.companyName || ""} onChange={(event) => updateSectionState("organization", "companyName", event.target.value)} />
          <Input label="GST Number" value={data.gstNumber || ""} onChange={(event) => updateSectionState("organization", "gstNumber", event.target.value)} />
          <Input label="Logo URL" value={data.logoUrl || ""} onChange={(event) => updateSectionState("organization", "logoUrl", event.target.value)} />
          <Input label="Address" value={data.address || ""} onChange={(event) => updateSectionState("organization", "address", event.target.value)} />
        </div>
      );
    }

    if (activeSection === "rolePermissions") {
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          {Object.keys(roleLabels).map((role) => (
            <div key={role} className="rounded-3xl border border-slate-200 bg-white/80 p-4">
              <h3 className="font-semibold text-slate-900">{roleLabels[role]}</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {permissionOptions.map((permission) => (
                  <BooleanField
                    key={`${role}-${permission}`}
                    label={permission}
                    checked={(data[role] || []).includes(permission)}
                    onChange={() => togglePermission(role, permission)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === "inventory") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Default Low Stock Limit" type="number" value={data.lowStockLimit ?? ""} onChange={(event) => updateSectionState("inventory", "lowStockLimit", Number(event.target.value))} />
          <BooleanField label="Stock alerts" checked={data.stockAlerts} onChange={(value) => updateSectionState("inventory", "stockAlerts", value)} />
          <BooleanField label="Auto reorder suggestions" checked={data.autoReorder} onChange={(value) => updateSectionState("inventory", "autoReorder", value)} />
        </div>
      );
    }

    if (activeSection === "payment") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {user?.role === "ADMIN" && <Input label="Razorpay Key ID" value={data.razorpayKeyId || ""} onChange={(event) => updateSectionState("payment", "razorpayKeyId", event.target.value)} />}
          <BooleanField label="Razorpay enabled" checked={data.razorpayEnabled} onChange={(value) => updateSectionState("payment", "razorpayEnabled", value)} />
          <BooleanField label="UPI" checked={data.upiEnabled} onChange={(value) => updateSectionState("payment", "upiEnabled", value)} />
          <BooleanField label="Card" checked={data.cardEnabled} onChange={(value) => updateSectionState("payment", "cardEnabled", value)} />
          <BooleanField label="Cash" checked={data.cashEnabled} onChange={(value) => updateSectionState("payment", "cashEnabled", value)} />
        </div>
      );
    }

    if (activeSection === "invoice") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="GST Percent" type="number" value={data.gstPercent ?? ""} onChange={(event) => updateSectionState("invoice", "gstPercent", Number(event.target.value))} />
          <Input label="Invoice Prefix" value={data.invoicePrefix || ""} onChange={(event) => updateSectionState("invoice", "invoicePrefix", event.target.value)} />
          <Input label="Invoice Logo URL" value={data.logoUrl || ""} onChange={(event) => updateSectionState("invoice", "logoUrl", event.target.value)} />
          <Input label="Footer Note" value={data.footerNote || ""} onChange={(event) => updateSectionState("invoice", "footerNote", event.target.value)} />
        </div>
      );
    }

    if (activeSection === "security") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Session Timeout Minutes" type="number" value={data.sessionTimeoutMinutes ?? ""} onChange={(event) => updateSectionState("security", "sessionTimeoutMinutes", Number(event.target.value))} />
          <BooleanField label="Record login activity" checked={data.loginActivity} onChange={(value) => updateSectionState("security", "loginActivity", value)} />
          <BooleanField label="Notify on new login" checked={data.notifyNewLogin} onChange={(value) => updateSectionState("security", "notifyNewLogin", value)} />
        </div>
      );
    }

    if (activeSection === "integration") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="SMTP Host" value={data.smtpHost || ""} onChange={(event) => updateSectionState("integration", "smtpHost", event.target.value)} />
          <Input label="SMTP Port" type="number" value={data.smtpPort ?? ""} onChange={(event) => updateSectionState("integration", "smtpPort", Number(event.target.value))} />
          <Input label="SMTP User" value={data.smtpUser || ""} onChange={(event) => updateSectionState("integration", "smtpUser", event.target.value)} />
          <Input label="Cloudinary Cloud Name" value={data.cloudinaryCloudName || ""} onChange={(event) => updateSectionState("integration", "cloudinaryCloudName", event.target.value)} />
          <Input label="Cloudinary API Key" value={data.cloudinaryApiKey || ""} onChange={(event) => updateSectionState("integration", "cloudinaryApiKey", event.target.value)} />
          <Input label="Razorpay Key ID" value={data.razorpayKeyId || ""} onChange={(event) => updateSectionState("integration", "razorpayKeyId", event.target.value)} />
        </div>
      );
    }

    if (activeSection === "data") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <BooleanField label="Enable CSV export" checked={data.csvExport} onChange={(value) => updateSectionState("data", "csvExport", value)} />
          <BooleanField label="Enable CSV import" checked={data.csvImport} onChange={(value) => updateSectionState("data", "csvImport", value)} />
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
            Last export: {data.lastExportAt ? new Date(data.lastExportAt).toLocaleString() : "Never"}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Settings" title="Settings" description="Manage personal preferences and role-based OmniStock Flow configuration." />
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="glass-panel rounded-3xl p-3">
          <nav className="space-y-2">
            {visibleSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === section ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-white/80"
                }`}
              >
                {sectionMeta[section].label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="glass-panel rounded-3xl p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow={activeMeta.label} title={activeMeta.label} description={activeMeta.description} />
            <Button type="button" onClick={() => saveSection(activeSection)} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
          {renderSection()}
        </section>
      </div>
    </PageWrapper>
  );
}

export default Settings;
