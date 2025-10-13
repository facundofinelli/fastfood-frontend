import React, { useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";

export type FilterOption =
  | {
      type: "text";
      name: string;
      label: string;
      value: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      value: string;
      options: { label: string; value: string }[];
    };

type FilterProps = {
  filters: FilterOption[];
  onChange: (name: string, value: string) => void;
  onApply: () => void;
  onClear?: () => void;
};

export default function Filter({ filters, onChange, onApply, onClear }: FilterProps) {
  const [open, setOpen] = useState(false);

  const renderFilters = () => (
    <div className="flex flex-col gap-4">
      {filters.map((filter) => {
        if (filter.type === "text") {
          return (
            <div key={filter.name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{filter.label}</label>
              <input
                type="text"
                value={filter.value}
                onChange={(e) => onChange(filter.name, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          );
        }

        if (filter.type === "select") {
          return (
            <div key={filter.name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{filter.label}</label>
              <select
                value={filter.value}
                onChange={(e) => onChange(filter.name, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Seleccionar...</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return null;
      })}

      {/* Botón filtrar */}
      <button
        onClick={onApply}
        className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors text-sm font-semibold"
      >
        Filtrar
      </button>

      {/* Botón limpiar */}
      {onClear && (
        <button
          onClick={onClear}
          className="mt-2 w-full text-sm text-gray-600 border rounded px-3 py-2 hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: sidebar fijo */}
      <div className="hidden md:block w-64 bg-white shadow-md rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        {renderFilters()}
      </div>

      {/* Mobile: botón + panel lateral */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 border rounded bg-white shadow-sm"
        >
          <FilterIcon className="w-5 h-5" />
          Filtros
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* Fondo oscuro */}
            <div
              className="flex-1 bg-black bg-opacity-40"
              onClick={() => setOpen(false)}
            ></div>

            {/* Panel lateral */}
            <div className="w-72 bg-white p-4 shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderFilters()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
