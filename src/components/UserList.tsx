import { ListComponent } from "./shared/ListComponent";
import apiService from "../services/ApiService";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  return (
    <ListComponent<User>
      title="Usuarios"
      addPath="/user/add"
      fetchUrl="/users"
      columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Nombre" },
        { key: "email", header: "Email" },
      ]}
      filters={[
        { type: "text", name: "name", label: "Nombre", value: "" },
        { type: "select", name: "role", label: "Rol", value: "", options: [
          { label: "Admin", value: "admin" },
          { label: "Usuario", value: "user" }
        ]}
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/users/${id}`);
      }}
    />
  );
}
