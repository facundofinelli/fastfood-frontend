import apiService from "../../services/ApiService";
import { ListComponent } from "../shared/ListComponent";

type Promotion = {
  id: number;
  description: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  product_id: string | number;
  product: any;
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
        { key: "startDate" , header: "Fecha inicio", render: (item) => new Date(item.startDate).toLocaleDateString()},
        { key: "endDate"    , header: "Fecha de fin", render: (item) => new Date(item.endDate).toLocaleDateString()},
        { key: "product_id" , header: "Producto", render: (item) => item.product.description},
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/promotions/${id}`);
      }}
    />
  );
}