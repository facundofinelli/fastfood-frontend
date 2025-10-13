import { ListComponent } from "../shared/ListComponent";
import apiService from "../../services/ApiService";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function ProviderList() {
  return (
    <ListComponent<User>
      title="Proveedores"
      addPath="/provider/add"
      fetchUrl="/providers"
      columns={[
        { key: "name", header: "Nombre" },
        { key: "email", header: "Email" },
      ]}
      onDelete={async (id) => {
        await apiService.delete(`/providers/${id}`);
      }}
    />
  );
}
