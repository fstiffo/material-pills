import { DataGrid } from "@material-ui/data-grid";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";

export default function PurchasesGrid(props) {
  const purchases = useLiveQuery(
    () => props.db.purchases.with({ medication: "medicationId" }),
    []
  );
  if (!purchases) return null;
  const pursCols = [
    {
      field: "purchaseDay",
      headerName: "Date",
      valueGetter: (params) =>
        `${dayjs(params.getValue("date")).format("DD/MM/YYYY")}`,
      width: 120
    },
    {
      field: "medicationName",
      headerName: "Medication",
      valueGetter: (params) => params.getValue("medication").brandName,
      width: 200
    },
    { field: "quantity", headerName: "Qty", width: 80 }
  ];

  return (
    <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
      <h2>Purchases</h2>
      <DataGrid rows={purchases} columns={pursCols} pageSize={5} />
    </div>
  );
}
