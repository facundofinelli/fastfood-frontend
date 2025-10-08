// ListComponent.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./Table";
import Filter from "./Filter";
import type { FilterOption } from "./Filter";
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
  onDelete?: (id: number | string) => Promise<void>;
  filters?: FilterOption[]; // 👈 NUEVO: filtros opcionales
};

export function ListComponent<T extends { id: number | string; name?: string }>({
  title,
  addPath,
  fetchUrl,
  columns,
  onDelete,
  filters = [], // default vacío
}: ListComponentProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filtersState, setFiltersState] = useState<FilterOption[]>(filters); // estado interno
  const navigate = useNavigate();

  // Cargar entidades con filtros
  const fetchData = async () => {
    try {
      // si querés mandar filtros como query params:
      const params = filtersState
        .filter((f) => f.value) // solo los que tienen valor
        .map((f) => `${f.name}=${encodeURIComponent(f.value)}`)
        .join("&");

      const url = params ? `${fetchUrl}?${params}` : fetchUrl;
      const result = await apiService.get<T[]>(url);

      if (!result || result.length === 0) {
        setErrorMessage("No hay datos disponibles para mostrar.");
      } else {
        setErrorMessage("");
      }

      setData(result);
    } catch (error: any) {
      console.error("Error cargando datos:", error);

      if (error.status === 404) {
        setErrorMessage("No se encontró la ruta o recurso solicitado (404).");
      } else if (error.status === 500) {
        setErrorMessage("Error interno del servidor. Intenta más tarde.");
      } else if (error.status === 0) {
        setErrorMessage("Error de conexión. Verifica tu red.");
      } else {
        setErrorMessage("Ocurrió un error inesperado.");
      }

      setData([]); // Limpia la tabla en caso de error
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchUrl, filtersState]); // 👈 cada vez que cambian filtros, recarga

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

  const handleFilterChange = (name: string, value: string) => {
    setFiltersState((prev) =>
      prev.map((f) => (f.name === name ? { ...f, value } : f))
    );
  };

  const handleClearFilters = () => {
    setFiltersState((prev) => prev.map((f) => ({ ...f, value: "" })));
  };

  if (errorMessage) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar filtros (si hay) */}
      {filters.length > 0 && (
        <div className="md:w-64 w-full">
          <Filter
            filters={filtersState}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1">
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
                    onClick={() =>
                      navigate(`${addPath.replace("/add", "/edit")}/${item.id}`)
                    }
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
    </div>
  );
}
