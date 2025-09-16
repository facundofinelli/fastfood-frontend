import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./shared/Table";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/users") // 👈 ajustar puerto
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
    });
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>
      <Table
        data={users}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Nombre" },
          { key: "email", header: "Email" },
          {
            key: "actions",
            header: "Acciones",
            render: (user) => (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => setConfirmDelete(user)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* Confirmación de borrado */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-4">
              ¿Está seguro que desea eliminar al usuario{" "}
              <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
