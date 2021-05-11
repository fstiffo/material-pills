import "./styles.css";
import { Button } from "@material-ui/core";
import Dexie from "dexie";
import relationships from "dexie-relationships";
import dayjs from "dayjs";
import MedicationsTable from "./MedicationsTable";
import PrescriptionsTable from "./PrescriptionsTable";
import PurchasesTable from "./PurchasesTable";

const db = new Dexie("PILLS_DB", { addons: [relationships] });

db.version(2).stores({
  medications: "++id,&[brandName+strength+unity+quantity], name, manufacturer",
  prescriptions: "++id, &[drugName+dose+unity], days",
  purchases: "++id, medicationId -> medications.id, quantity, date"
});

db.transaction("rw", db.medications, db.prescriptions, db.purchases, () => {
  // Medications
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
  // Prescriptions
  db.prescriptions.clear();
  db.prescriptions.bulkPut([
    { drugName: "aspirina", dose: 100, unity: "mg", days: 1 },
    { drugName: "paracetamolo", dose: 500, unity: "mg", days: 7 }
  ]);
  // Purchases
  db.purchases.clear();
  db.purchases.count().then((count) => {
    if (count === 0) {
      db.purchases.bulkPut([
        { medicationId: 1, quantity: 1, date: dayjs().format() },
        { medicationId: 2, quantity: 3, date: dayjs().format() }
      ]);
    }
  });
});

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen! Really?</h2>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
      <hr />
      <MedicationsTable db={db} />
      <PrescriptionsTable db={db} />
      <PurchasesTable db={db} />
    </div>
  );
}
