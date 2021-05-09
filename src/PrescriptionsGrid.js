import { DataGrid } from "@material-ui/data-grid";
import { useLiveQuery } from "dexie-react-hooks";

export default function PrescriptionsGrid(props) {
  const prescriptions = useLiveQuery(
    () => props.db.prescriptions.toArray(),
    []
  );
  if (!prescriptions) return null;
  const presCols = [
    { field: "drugName", headerName: "Drug", width: 160 },
    {
      field: "fullDose",
      headerName: "Dose",
      sortable: false,
      valueGetter: (params) =>
        `${params.getValue("dose")} ${params.getValue("unity")}`,
      width: 120
    },
    {
      field: "every",
      headerName: "Every",
      sortable: false,
      valueGetter: (params) =>
        `${params.getValue("days")} day${
          params.getValue("days") > 1 ? "s" : ""
        }`
    }
  ];
  return (
    <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
      <h2>Prescriptions</h2>
      <DataGrid rows={prescriptions} columns={presCols} pageSize={5} />
    </div>
  );
}
