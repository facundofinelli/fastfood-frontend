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
  onEdit?: boolean;
  onDelete?: (id: number | string) => Promise<void>;
  filters?: FilterOption[];
  customActions?: (item: T) => React.ReactNode; // 👈 nueva prop opcional
};

export function ListComponent<T extends { id: number | string; name?: string }>({
  title,
  addPath,
  fetchUrl,
  columns,
  onEdit = true,
  onDelete,
  filters = [],
  customActions,
}: ListComponentProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [filtersState, setFiltersState] = useState<FilterOption[]>(filters);
  const [appliedFilters, setAppliedFilters] = useState<FilterOption[]>(filters);

  const navigate = useNavigate();

  // 🔹 Carga de datos
  const fetchData = async (filtersToApply: FilterOption[]) => {
    try {
      const params = filtersToApply
        .filter(f => f.value)
        .map(f => `${f.name}=${encodeURIComponent(f.value)}`)
        .join("&");

      const url = params ? `${fetchUrl}?${params}` : fetchUrl;
      const result = await apiService.get<T[]>(url);

      if (!result || result.length === 0) {
        setErrorMessage("No hay datos disponibles para mostrar.");
        setData([]);
      } else {
        setErrorMessage("");
        setData(result);
      }
    } catch (error: any) {
      console.error("Error cargando datos:", error);
      setErrorMessage("Ocurrió un error al cargar los datos.");
      setData([]);
    }
  };

  useEffect(() => {
    fetchData(appliedFilters);
  }, [fetchUrl, appliedFilters]);

  // 🔹 Eliminar
  const handleDelete = async (id: number | string) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
      setData(prev => prev.filter(item => item.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setErrorMessage("No se pudo eliminar. Intenta más tarde.");
    }
  };

  // 🔹 Filtros
  const handleFilterChange = (name: string, value: string) => {
    setFiltersState(prev =>
      prev.map(f => (f.name === name ? { ...f, value } : f))
    );
  };

  const handleClearFilters = () => {
    const cleared = filtersState.map(f => ({ ...f, value: "" }));
    setFiltersState(cleared);
    setAppliedFilters(cleared);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filtersState);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar de filtros */}
      {filters.length > 0 && (
        <div className="md:w-64 w-full">
          <Filter
            filters={filtersState}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {addPath !== "" && (
            <button
              onClick={() => navigate(addPath)}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Agregar
            </button>
          )}
        </div>

        {/* Si hay error general */}
        {errorMessage && !data.length ? (
          <div className="text-center text-red-500 font-semibold mt-6">
            {errorMessage}
          </div>
        ) : (
          <Table
            data={data}
            columns={[
              ...columns,
              {
                key: "actions",
                header: "Acciones",
                render: item => (
                  <div className="flex flex-col">
                    {/* Acciones personalizadas */}
                    {customActions && (
                      <div className="flex flex-col">
                        {customActions(item)}
                      </div>
                    )}
                    {/* Acciones base */}
                    {onEdit && (
                      <button
                        onClick={() =>
                          navigate(
                            `${addPath.replace("/add", "/edit")}/${item.id}`
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => setConfirmDelete(item)}
                        className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}

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
