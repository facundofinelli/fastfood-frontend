import { ListComponent } from "../shared/ListComponent";

type Order = {
  id: number;
  status: string;
};

export default function OrderList() {
  return (
    <ListComponent<Order>
      title="Pedidos"
      addPath=""
      fetchUrl="/orders"
      columns={[
        { key: "id", header: "ID" },
        { key: "status", header: "Estado" },
      ]}
      onDelete={async () => {
        //await apiService.delete(`/orders/${id}`);
      }}
    />
  );
}
