import { useEffect, useState } from "react";
import storeService from "../../services/storeService";
import SectionHeader from "../../components/common/SectionHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import StoreFormModal from "./StoreFormModal";

function ManageStores() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const loadStores = () =>
    storeService.getAll().then((response) => setItems(response.data.data));

  useEffect(() => {
    loadStores();
  }, []);

  const submitHandler = async (payload) => {
    if (editingStore) {
      await storeService.update(editingStore._id, payload);
    } else {
      await storeService.create(payload);
    }
    setModalOpen(false);
    setEditingStore(null);
    loadStores();
  };

  const deleteHandler = async (id) => {
    await storeService.remove(id);
    loadStores();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Admin"
          title="Stores"
          description="Review store network coverage and assigned managers."
        />
        <Button
          onClick={() => {
            setEditingStore(null);
            setModalOpen(true);
          }}
        >
          Add Store
        </Button>
      </div>
      <Table
        columns={[
          { key: "name", label: "Store" },
          { key: "code", label: "Code" },
          { key: "location", label: "Location" },
          { key: "manager", label: "Manager", render: (row) => row.manager?.name || "-" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingStore(row);
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
          },
        ]}
        data={items}
      />
      <StoreFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStore(null);
        }}
        onSubmit={submitHandler}
        initialValues={editingStore}
      />
    </div>
  );
}

export default ManageStores;
