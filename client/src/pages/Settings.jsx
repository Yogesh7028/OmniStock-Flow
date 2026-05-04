import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  CreditCard,
  Database,
  FileText,
  Lock,
  Palette,
  PlugZap,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import SectionHeader from "../components/common/SectionHeader";
import settingsService from "../services/settingsService";
import { useAuth } from "../context/AuthContext";

const sectionMeta = {
  account: { label: "Account", description: "Profile, password, and OTP preferences.", icon: User },
  notifications: { label: "Notifications", description: "Email, SMS, and operational alert preferences.", icon: Bell },
  appearance: { label: "Appearance", description: "Theme and display preferences.", icon: Palette },
  organization: { label: "Organization", description: "Company identity, GST, and logo settings.", icon: Building2 },
  rolePermissions: { label: "Roles", description: "Role-based permission groups.", icon: Users },
  inventory: { label: "Inventory", description: "Stock limits and alert behavior.", icon: SlidersHorizontal },
  payment: { label: "Payments", description: "Razorpay and accepted payment methods.", icon: CreditCard },
  invoice: { label: "Invoices", description: "GST, invoice prefix, logo, and footer notes.", icon: FileText },
  security: { label: "Security", description: "Session timeout and login activity settings.", icon: ShieldCheck },
  integration: { label: "Integrations", description: "SMTP, Cloudinary, and Razorpay integration references.", icon: PlugZap },
  data: { label: "Data", description: "CSV export and import preferences.", icon: Database },
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
  <motion.label
    whileHover={{ y: -2 }}
    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm"
  >
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      type="checkbox"
      className="sr-only"
      checked={Boolean(checked)}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? "bg-teal-700" : "bg-slate-200"
      }`}
    >
      <motion.span
        layout
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      />
    </span>
  </motion.label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <select
      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.12)]"
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const activeMeta = sectionMeta[activeSection] || sectionMeta.account;
  const visibleSections = useMemo(
    () => allowedSections.filter((section) => sectionMeta[section]),
    [allowedSections]
  );
  const ActiveIcon = activeMeta.icon || Lock;

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setLoadError("");
      const response = await settingsService.getAll();
      const data = response.data?.data || {};
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

    loadSettings()
      .catch((error) => {
        const message = error.message || "Unable to load settings";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
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
        const response = await settingsService.updateAccount(accountForm);
        const data = response.data?.data || {};
        setSections((prev) => ({ ...prev, account: data.settings || prev.account || {} }));
        setAccountForm((prev) => ({
          ...prev,
          name: data.user?.name ?? prev.name,
          phone: data.user?.phone ?? prev.phone,
          storeName: data.user?.storeName ?? prev.storeName,
          otpEnabled: data.settings?.otpEnabled ?? prev.otpEnabled,
          currentPassword: "",
          newPassword: "",
        }));
        await refreshMe();
      } else {
        const response = await settingsService.updateSection(section, sections[section] || {});
        setSections((prev) => ({ ...prev, [section]: response.data?.data?.settings || prev[section] || {} }));
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
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/70 bg-slate-950 p-6 text-white shadow-soft"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-amber-300 to-emerald-400" />
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Settings</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Control center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Tune account preferences, permissions, security, payments, and operational defaults from one focused workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-2xl font-semibold">{visibleSections.length}</p>
              <p className="text-xs text-slate-300">Sections</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-2xl font-semibold">{user?.role ? "On" : "--"}</p>
              <p className="text-xs text-slate-300">Role access</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-2xl font-semibold">{saving ? "Saving" : "Ready"}</p>
              <p className="text-xs text-slate-300">Status</p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="glass-panel rounded-3xl p-3">
          <nav className="space-y-2">
            {visibleSections.map((section, index) => {
              const meta = sectionMeta[section];
              const Icon = meta.icon;
              return (
              <motion.button
                key={section}
                type="button"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035, duration: 0.28 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                  activeSection === section ? "bg-slate-950 text-white shadow-soft" : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    activeSection === section ? "bg-white/15 text-amber-300" : "bg-teal-50 text-teal-700"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span>{meta.label}</span>
              </motion.button>
            )})}
          </nav>
        </aside>

        <section className="glass-panel min-h-[32rem] rounded-3xl p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                key={activeSection}
                initial={{ scale: 0.85, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-soft"
              >
                <ActiveIcon size={22} />
              </motion.div>
              <SectionHeader eyebrow={activeMeta.label} title={activeMeta.label} description={activeMeta.description} />
            </div>
            <Button type="button" onClick={() => saveSection(activeSection)} disabled={saving || loading || Boolean(loadError)}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
          {loading && <div className="text-sm text-slate-600">Loading settings...</div>}
          {!loading && loadError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}
          {!loading && !loadError && visibleSections.length === 0 && (
            <div className="text-sm text-slate-600">No settings sections are available for this account.</div>
          )}
          <AnimatePresence mode="wait">
            {!loading && !loadError && visibleSections.length > 0 && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {renderSection()}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </PageWrapper>
  );
}

export default Settings;
