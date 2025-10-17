import apiService from "../../services/ApiService";
import { ListComponent } from "../shared/ListComponent";

type Ingredient = {
  id: number;
  description: string;
  createdAt: string;
};

export default function IngredientList() {
  return (
    <ListComponent<Ingredient>
      title="Ingredientes"
      addPath="/ingredient/add"
      fetchUrl="/ingredients"
      columns={[
        { key: "description", header: "Descripcion" },
        { key: "createdAt", header: "Creado el", render: (item) => new Date(item.createdAt).toLocaleDateString() },
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/ingredients/${id}`);
      }}
    />
  );
}
