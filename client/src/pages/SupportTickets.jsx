import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import supportTicketService from "../services/supportTicketService";
import PageWrapper from "../components/animations/PageWrapper";
import SectionHeader from "../components/common/SectionHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Table from "../components/common/Table";
import { useAuth } from "../context/AuthContext";

const emptyForm = { subject: "", message: "", priority: "MEDIUM" };

function SupportTickets() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    const response = await supportTicketService.getAll();
    setTickets(response.data.data);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await supportTicketService.create(form);
      toast.success("Support ticket created");
      setForm(emptyForm);
      await loadTickets();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (ticket, payload) => {
    setLoading(true);
    try {
      const response = await supportTicketService.update(ticket._id, payload);
      setTickets((current) =>
        current.map((item) => (item._id === ticket._id ? response.data.data : item))
      );
      toast.success("Ticket updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async (ticket) => {
    const response = responses[ticket._id]?.trim();
    if (!response) {
      toast.error("Enter a response first");
      return;
    }

    await updateTicket(ticket, { response });
    setResponses((current) => ({ ...current, [ticket._id]: "" }));
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader
        eyebrow="Support"
        title={isAdmin ? "Resolve support tickets" : "Support tickets"}
        description={
          isAdmin
            ? "Review user tickets, respond to queries, and move issues toward resolution."
            : "Raise operational issues and track resolution status."
        }
      />

      {!isAdmin && (
        <form onSubmit={submitHandler} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-3">
          <Input label="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Priority</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <Input label="Message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
          <div className="md:col-span-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      )}

      <Table
        columns={[
          { key: "subject", label: "Subject" },
          { key: "priority", label: "Priority" },
          { key: "status", label: "Status" },
          { key: "createdBy", label: "Created By", render: (row) => row.createdBy?.email || "-" },
          {
            key: "lastResponse",
            label: "Last Response",
            render: (row) => row.responses?.at(-1)?.message || "-",
          },
          {
            key: "actions",
            label: isAdmin ? "Resolve" : "Reply",
            render: (row) => (
              <div className="min-w-72 space-y-2">
                {isAdmin && (
                  <div className="flex flex-wrap gap-2">
                    {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={row.status === status ? "warning" : "secondary"}
                        disabled={loading || row.status === status}
                        onClick={() => updateTicket(row, { status })}
                      >
                        {status.replace("_", " ")}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm outline-none focus:border-teal-600"
                    placeholder={isAdmin ? "Write solution..." : "Add reply..."}
                    value={responses[row._id] || ""}
                    onChange={(event) => setResponses({ ...responses, [row._id]: event.target.value })}
                  />
                  <Button type="button" disabled={loading} onClick={() => sendResponse(row)}>
                    Send
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
        data={tickets}
      />
    </PageWrapper>
  );
}

export default SupportTickets;
