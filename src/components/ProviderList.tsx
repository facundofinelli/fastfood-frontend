import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./shared/Table";
import apiService from "../services/ApiService";

type Provider = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

export default function ProviderList() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Provider | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Cargar proveedores
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await apiService.get<Provider[]>("/providers");
        setProviders(data);
      } catch (error) {
        console.error("Error cargando proveedores:", error);
        setErrorMessage("No se pudieron cargar los proveedores.");
      }
    };

    fetchProviders();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiService.delete(`/providers/${id}`);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("No se pudo eliminar el proveedor.");
    }
  };

  if (errorMessage) {
    return (
      <div className="p-6 text-red-600 font-semibold">{errorMessage}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Proveedores</h1>
        <button
          onClick={() => navigate("/provider/add")}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Agregar proveedor
        </button>
      </div>

      <Table
        data={providers}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Nombre" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Teléfono" },
          {
            key: "actions",
            header: "Acciones",
            render: (provider) => (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/provider/${provider.id}`)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => setConfirmDelete(provider)}
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
              ¿Está seguro que desea eliminar al proveedor{" "}
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
