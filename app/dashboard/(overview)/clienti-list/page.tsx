import { getAllClienti } from "@/app/lib/actions/actions";
import { TableClienti } from "@/app/ui/table-wrapper/table-wrapper-clienti";

export default async function Page() {
  const clienti = await getAllClienti();
  return <TableClienti data={clienti} />;
}
