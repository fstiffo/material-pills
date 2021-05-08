import "./styles.css";
import { Button } from "@material-ui/core";
import { Dexie } from "dexie";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { useDexie, useDexieTable } from "use-dexie";

export default function App() {
  useDexie(
    "PILLS_DB",
    {
      medications:
        "++id,&[brand_name+strength+unity], name, manufacturer, quantity",
      prescriptions: "++id, &[drug_name+dose+unity], days"
    },
    (db) => {
      db.medications.count().then((count) => {
        if (count === 0) {
          db.medications.bulkPut([
            {
              brand_name: "Tachipirina",
              strength: 1000,
              unity: "mg",
              name: "paracetamolo",
              manufacturer: "Angelini",
              quantity: 20
            },
            {
              brand_name: "Cardioaspirin",
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
        { drug_name: "aspirina", dose: 100, unity: "mg", days: 1 },
        { drug_name: "paracetamolo", dose: 500, unity: "mg", days: 7 }
      ]);
    }
  );

  const medications = useDexieTable("medications") || [];
  const prescriptions = useDexieTable("prescriptions") || [];

  const meds_cols = [
    { field: "brand_name", headerName: "Brand Name", width: 160 },
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
  const pres_cols = [
    { field: "drug_name", headerName: "Drug", width: 160 },
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
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen! Really?</h2>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
      <hr />
      <div style={{ height: 400, width: "100%", marginBottom: 80 }}>
        <h2>Medications</h2>
        <DataGrid rows={medications} columns={meds_cols} pageSize={5} />
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <h2>Prescriptions</h2>
        <DataGrid rows={prescriptions} columns={pres_cols} pageSize={5} />
      </div>
    </div>
  );
}
