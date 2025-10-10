import apiService from "../../services/ApiService";
import { ListComponent } from "../shared/ListComponent";

type Category = {
  id: number;
  name: string;
};

export default function CategoryList() {
  return (
    <ListComponent<Category>
      title="Usuarios"
      addPath="/categories/add"
      fetchUrl="/categories"
      columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Nombre" },
      ]}
      filters={[
        { type: "text", name: "name", label: "Nombre", value: "" },
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/category/${id}`);
      }}
    />
  );
}
