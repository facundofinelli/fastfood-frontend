// src/components/shared/ListComponent.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./Table";
import apiService from "../../services/ApiService";

type Column<T> = {
  key: keyof T | "actions";
  header: string;
  render?: (item: T) => React.ReactNode;
};

type ListComponentProps<T> = {
  title: string;
  addPath: string;
  fetchUrl: string;
  columns: Column<T>[];
  onDelete?: (id: number | string) => Promise<void>; // opcional por si no todas las entidades se borran
};

export function ListComponent<T extends { id: number | string; name?: string }>({
  title,
  addPath,
  fetchUrl,
  columns,
  onDelete,
}: ListComponentProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Cargar entidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.get<T[]>(fetchUrl);
        setData(result);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setErrorMessage("No se pudieron cargar los datos. Intenta más tarde.");
      }
    };
    fetchData();
  }, [fetchUrl]);

  const handleDelete = async (id: number | string) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setErrorMessage("No se pudo eliminar. Intenta más tarde.");
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
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          onClick={() => navigate(addPath)}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Agregar
        </button>
      </div>

      {/* Tabla */}
      <Table
        data={data}
        columns={[
          ...columns,
          {
            key: "actions",
            header: "Acciones",
            render: (item) => (
              <>
                <button
                  onClick={() => navigate(`${addPath.replace("/add", "/edit")}/${item.id}`)}
                  className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                >
                  Editar
                </button>
                {onDelete && (
                  <button
                    onClick={() => setConfirmDelete(item)}
                    className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                  >
                    Eliminar
                  </button>
                )}
              </>
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
              ¿Está seguro que desea eliminar{" "}
              <strong>{confirmDelete.name ?? `ID ${confirmDelete.id}`}</strong>?
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
