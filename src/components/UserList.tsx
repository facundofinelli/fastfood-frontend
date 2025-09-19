import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./shared/Table";
import apiService from "../services/ApiService";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.get<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setErrorMessage("No se pudieron cargar los usuarios. Intenta más tarde.");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiService.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setErrorMessage("No se pudo eliminar el usuario. Intenta más tarde.");
    }
  };

  if (errorMessage) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <button
          onClick={() => navigate("/user/add")}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Agregar usuario
        </button>
      </div>

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
              <>
                <button
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                >
                  Editar
                </button>
                <button
                  onClick={() => setConfirmDelete(user)}
                  className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                >
                  Eliminar
                </button>
              </>
            ),
          }
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
