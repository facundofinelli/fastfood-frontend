import React, { useEffect, useState } from "react";
import { ListComponent } from "../shared/ListComponent";
import apiService from "../../services/ApiService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

type CartItem = {
  product      : any;
  id           : string;
  product_name : string;
  quantity     : number;
  price        : number;
};

export const Cart = () => {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [, setCartItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) return;

      try {
        const orders = await apiService.get<any[]>(`/orders?user_id=${user.id}&status=pending`);
        if (orders.length === 0) {
          setCartItems([]);
          return;
        }

        const order = orders[0];
        setOrderId(order.id);

 
      } catch (error) {
        console.error("Error cargando carrito:", error);
        setCartItems([]);
      }
    };

    loadCart();
  }, [user]);

  const handleDelete = async (id: string | number) => {
    if (!orderId) return;
    try {
      await apiService.delete(`/order-items/${id}`);
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error eliminando item:", error);
    }
  };

   const handleConfirmOrder = async () => {
    if (!orderId) return;
    try {
      await apiService.put(`/orders/${orderId}`, { status: "completed" });
      toast.success("Pedido confirmado ✅");
      setOrderId(null);
      setCartItems([]);
      navigate("/");
    } catch (error) {
      console.error("Error confirmando pedido:", error);
      toast.error("Hubo un error al confirmar el pedido ❌");
    }
  };


  return (
    <div>
      {orderId && (
        <ListComponent<CartItem>
          title="Tu Carrito"
          addPath=""
          fetchUrl={`/order-items?order_id=${orderId}`}
          columns={[
            {
              key: "product_name", 
              header: "Producto",
              render: (item) => item?.product?.name
            },
            { key: "quantity", header: "Cantidad" },
            { key: "price", header: "Precio" },
          ]}
          onDelete={handleDelete}
        />
      )}
      {!orderId && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium">Tu carrito está vacío 🛒</p>
          <p className="text-sm text-gray-400 mt-1">
            Agregá productos para poder hacer tu pedido.
          </p>
        </div>
      )}
      {orderId &&
        <button
          onClick={handleConfirmOrder}
          className="mt-6 mb-6 px-6 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
        >
          Confirmar pedido
        </button>
      }
    </div>
  );
};
