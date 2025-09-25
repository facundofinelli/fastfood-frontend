import { ListComponent } from "./shared/ListComponent";
import apiService from "../services/ApiService";

type Ingredient = {
  id: number;
  name: string;
  unit: string; // ej: gramos, litros, etc.
};

export default function IngredientList() {
  return (
    <ListComponent<Ingredient>
      title="Ingredientes"
      addPath="/ingredient/add"
      fetchUrl="/ingredients"
      columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Nombre" },
        { key: "unit", header: "Unidad" },
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/ingredients/${id}`);
      }}
    />
  );
}
