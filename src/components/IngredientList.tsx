import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "./shared/Table";
import apiService from "../services/ApiService";

type Ingredient = {
  id: number;
  name: string;
  unit: string; // ej: gramos, litros, etc.
};

export default function IngredientList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Ingredient | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Cargar ingredientes desde la API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await apiService.get<Ingredient[]>("/ingredients");
        setIngredients(data);
      } catch (error) {
        console.error("Error cargando ingredientes:", error);
        setErrorMessage("No se pudieron cargar los ingredientes. Intenta más tarde.");
      }
    };

    fetchIngredients();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiService.delete(`/ingredients/${id}`);
      setIngredients((prev) => prev.filter((i) => i.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar ingrediente:", error);
      setErrorMessage("No se pudo eliminar el ingrediente. Intenta más tarde.");
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
        <h1 className="text-xl font-bold">Ingredientes</h1>
        <button
          onClick={() => navigate("/ingredient/add")}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Agregar ingrediente
        </button>
      </div>

      <Table
        data={ingredients}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Nombre" },
          { key: "unit", header: "Unidad" },
          {
            key: "actions",
            header: "Acciones",
            render: (ingredient) => (
              <div>
                <button
                  onClick={() => navigate(`/ingredient/${ingredient.id}`)}
                  className="px-3 py-2 hover:bg-gray-100 text-left w-full"
                >
                  Editar
                </button>
                <button
                  onClick={() => setConfirmDelete(ingredient)}
                  className="px-3 py-2 hover:bg-gray-100 text-left w-full"
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
              ¿Está seguro que desea eliminar el ingrediente{" "}
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
