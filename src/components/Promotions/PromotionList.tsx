import { ListComponent } from "../shared/ListComponent";

type Promotion = {
  id: number;
  description: string;
  discount: number;
  start_date: Date;
  product_id: string | number;
};

export default function PromotionList() {
  return (
    <ListComponent<Promotion>
      title="Promociones"
      addPath="/promotions/add"
      fetchUrl="/promotions"
      columns={[
        { key: "id", header: "ID" },
        { key: "description", header: "Descripción" },
        { key: "discount"   , header: "Descuento"   },
        { key: "start_date" , header: "Fecha inicio"},
        { key: "product_id" , header: "Producto"    },
      ]}
      onDelete={async () => {
        //await apiService.delete(`/orders/${id}`);
      }}
    />
  );
}