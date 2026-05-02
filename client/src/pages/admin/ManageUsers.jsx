import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/users/userSlice";
import userService from "../../services/userService";
import SectionHeader from "../../components/common/SectionHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import UserFormModal from "./UserFormModal";

function ManageUsers() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.users);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const reload = () => dispatch(fetchUsers());

  const submitHandler = async (payload) => {
    if (editingUser) {
      const updatePayload = { ...payload };
      if (!updatePayload.password) delete updatePayload.password;
      await userService.update(editingUser._id, updatePayload);
    } else {
      await userService.create(payload);
    }
    setModalOpen(false);
    setEditingUser(null);
    reload();
  };

  const deleteHandler = async (id) => {
    await userService.remove(id);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Admin"
          title="Manage users"
          description="Review users, roles, verification state, and account creation timeline."
        />
        <Button
          onClick={() => {
            setEditingUser(null);
            setModalOpen(true);
          }}
        >
          Add User
        </Button>
      </div>
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "role", label: "Role" },
          { key: "isVerified", label: "Verified", render: (row) => (row.isVerified ? "Yes" : "No") },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingUser(row);
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
      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={submitHandler}
        initialValues={editingUser}
      />
    </div>
  );
}

export default ManageUsers;
