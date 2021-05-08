import "./styles.css";
import { Button } from "@material-ui/core";
import { Dexie } from "dexie";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { useDexie, useDexieTable } from "use-dexie";
import dayjs from "dayjs";

export default function App() {
  useDexie(
    "PILLS_DB",
    {
      medications:
        "++id,&[brandName+strength+unity+quantity], name, manufacturer",
      prescriptions: "++id, &[drugName+dose+unity], days",
      purchases: "++id, medicationId, quantity, date"
    },
    (db) => {
      db.medications.count().then((count) => {
        if (count === 0) {
          db.medications.bulkPut([
            {
              brandName: "Tachipirina",
              strength: 1000,
              unity: "mg",
              name: "paracetamolo",
              manufacturer: "Angelini",
              quantity: 20
            },
            {
              brandName: "Cardioaspirin",
              strength: 100,
              unity: "mg",
              name: "aspirina",
              manufacturer: "Bayer",
              quantity: 30
            }
          ]);
        }
      });

      db.prescriptions.clear();
      db.prescriptions.bulkPut([
        { drugName: "aspirina", dose: 100, unity: "mg", days: 1 },
        { drugName: "paracetamolo", dose: 500, unity: "mg", days: 7 }
      ]);

      db.purchases.clear();
      db.purchases.count().then((count) => {
        if (count === 0) {
          db.purchases.bulkPut([
            { medicationId: 1, quantity: 1, date: dayjs().format() },
            { medicationId: 2, quantity: 3, date: dayjs().format() }
          ]);
        }
      });
    }
  );

  const medications = useDexieTable("medications") || [];
  const prescriptions = useDexieTable("prescriptions") || [];
  const purchases = useDexieTable("purchases") || [];

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
  const pursCols = [
    {
      field: "purchaseDay",
      headerName: "Date",
      valueGetter: (params) =>
        `${dayjs(params.getValue("date")).format("DD/MM/YYYY")}`,
width: 120
    },
    { field: "medicationId", headerName: "Medication", width: 130 },
    { field: "quantity", headerName: "Qty", width: 80 }
  ];

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen! Really?</h2>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
      <hr />
      <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
        <h2>Medications</h2>
        <DataGrid rows={medications} columns={medsCols} pageSize={5} />
      </div>
      <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
        <h2>Prescriptions</h2>
        <DataGrid rows={prescriptions} columns={presCols} pageSize={5} />
      </div>
      <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
        <h2>Purchases</h2>
        <DataGrid rows={purchases} columns={pursCols} pageSize={5} />
      </div>
    </div>
  );
}
