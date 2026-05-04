import { useEffect, useState } from "react";
import warehouseService from "../../services/warehouseService";
import userService from "../../services/userService";
import SectionHeader from "../../components/common/SectionHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import WarehouseFormModal from "./WarehouseFormModal";
import { useAuth } from "../../context/AuthContext";

function ManageWarehouses() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [warehouseManagers, setWarehouseManagers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const isAdmin = user?.role === "ADMIN";

  const loadWarehouses = () =>
    warehouseService.getAll().then((response) => setItems(response.data.data));

  const loadWarehouseManagers = () =>
    userService.getAll().then((response) => {
      const managers = response.data.data.filter((user) => user.role === "WAREHOUSE_MANAGER");
      setWarehouseManagers(managers);
    });

  useEffect(() => {
    loadWarehouses();
    if (isAdmin) {
      loadWarehouseManagers();
    }
  }, [isAdmin]);

  const submitHandler = async (payload) => {
    if (editingWarehouse) {
      await warehouseService.update(editingWarehouse._id, payload);
    } else {
      await warehouseService.create(payload);
    }
    setModalOpen(false);
    setEditingWarehouse(null);
    loadWarehouses();
  };

  const deleteHandler = async (id) => {
    await warehouseService.remove(id);
    loadWarehouses();
  };

  const warehouseColumns = [
    { key: "name", label: "Warehouse" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { key: "manager", label: "Manager", render: (row) => row.manager?.name || row.manager?.email || "-" },
    {
      key: "stockTotal",
      label: "Stock Left",
      render: (row) =>
        `${(row.stock || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)} units`,
    },
    {
      key: "stock",
      label: "Products",
      render: (row) => {
        const stockItems = (row.stock || []).filter((item) => Number(item.quantity || 0) > 0);

        if (!stockItems.length) {
          return <span className="text-slate-400">No stock</span>;
        }

        return (
          <div className="min-w-64 space-y-2">
            {stockItems.map((item) => (
              <div
                key={item._id || item.product?._id || item.product}
                className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800">{item.product?.name || "Unknown product"}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    item.product?.lowStockThreshold !== undefined &&
                    Number(item.quantity || 0) <= Number(item.product.lowStockThreshold || 0)
                      ? "bg-amber-50 text-amber-700"
                      : "bg-teal-50 text-teal-700"
                  }`}
                >
                  {item.quantity} left
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  if (isAdmin) {
    warehouseColumns.push({
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setEditingWarehouse(row);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button variant="warning" onClick={() => deleteHandler(row._id)}>
            Delete
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow={isAdmin ? "Admin" : "Warehouse"}
          title="Warehouses"
          description="View each warehouse location, manager assignment, and remaining product stock."
        />
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingWarehouse(null);
              setModalOpen(true);
            }}
          >
            Add Warehouse
          </Button>
        )}
      </div>
      <Table columns={warehouseColumns} data={items} />
      <WarehouseFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWarehouse(null);
        }}
        onSubmit={submitHandler}
        initialValues={editingWarehouse}
        warehouseManagers={warehouseManagers}
      />
    </div>
  );
}

export default ManageWarehouses;
