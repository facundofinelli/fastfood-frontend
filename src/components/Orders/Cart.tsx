import React, { useEffect, useState } from "react";
import { ListComponent } from "../shared/ListComponent";
import apiService from "../../services/ApiService";

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
    </div>
  );
};
