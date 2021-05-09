import { DataGrid } from "@material-ui/data-grid";
import { useLiveQuery } from "dexie-react-hooks";

export default function MedicationGrid(props) {
  const medications = useLiveQuery(() => props.db.medications.toArray(), []);
  if (!medications) return null;

  const medsCols = [
    { field: "brandName", headerName: "Brand Name", width: 160 },
    { field: "name", headerName: "Drug Name", width: 160 },
    {
      field: "fullStrength",
      headerName: "Strength",
      sortable: false,
      valueGetter: (params) =>
        `${params.getValue("strength")} ${params.getValue("unity")}`,
      width: 120
    },
    { field: "quantity", headerName: "Tablets" }
  ];

  return (
    <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
      <h2>Medications</h2>
      <DataGrid rows={medications} columns={medsCols} pageSize={5} />
    </div>
  );
}
