import React, { useState } from "react";
import { ListComponent } from "../shared/ListComponent";
import apiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

type Order = {
  id: number;
  status: "pending" | "completed" | "canceled";
};

const statusMap: Record<Order["status"], string> = {
  pending: "Pendiente",
  completed: "Confirmado",
  canceled: "Cancelado",
};

export default function OrderList() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const navigate = useNavigate();

  const handleView = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setLoadingAction(true);
      await apiService.put(`/orders/${selectedOrder.id}`, {
        status: "completed",
      });
      setSelectedOrder({ ...selectedOrder, status: "completed" });
      navigate(0);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    try {
      setLoadingAction(true);
      await apiService.put(`/orders/${selectedOrder.id}`, {
        status: "canceled",
      });
      setSelectedOrder({ ...selectedOrder, status: "canceled" });
      navigate(0);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <ListComponent<Order>
        title="Pedidos"
        addPath=""
        fetchUrl="/orders"
        columns={[
          { key: "id", header: "ID" },
          {
            key: "status",
            header: "Estado",
            render: (order) => statusMap[order.status],
          },
        ]}
        onEdit={false}
        customActions={(order) => (
          <button
            onClick={() => handleView(order)}
            className="px-3 py-2 hover:bg-gray-100 text-left w-full"
          >
            Ver detalle
          </button>
        )}
      />

      {/* Visor modal con zoom */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] md:w-[600px] p-6 scale-100 transition-transform duration-200 hover:scale-105">
            <h2 className="text-xl font-bold mb-4">Detalle del Pedido</h2>

            <div className="space-y-2 mb-6">
              <p>
                <strong>ID:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={`capitalize px-2 py-1 rounded ${
                    selectedOrder.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : selectedOrder.status === "canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {statusMap[selectedOrder.status]}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border rounded"
              >
                Cerrar
              </button>
              <button
                disabled={
                  selectedOrder.status === "completed" || loadingAction
                }
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${
                  selectedOrder.status === "completed"
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Confirmar
              </button>
              <button
                disabled={
                  selectedOrder.status === "canceled" || loadingAction
                }
                onClick={handleCancel}
                className={`px-4 py-2 rounded text-white ${
                  selectedOrder.status === "canceled"
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
