import { ListComponent } from "./shared/ListComponent";
import apiService from "../services/ApiService";

type Category = {
  id: number;
  name: string;
};

export default function CategoryList() {
  return (
    <ListComponent<Category>
      title="Usuarios"
      addPath="/user/add"
      fetchUrl="/users"
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
