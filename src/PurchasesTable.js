import MaterialTable from "material-table";
import { useLiveQuery } from "dexie-react-hooks";

export default function PurchasesTable(props) {
  const purchases = useLiveQuery(
    () => props.db.purchases.with({ medication: "medicationId" }),
    []
  );
  const medications = useLiveQuery(() => props.db.medications.toArray(), []);
  if (!medications || !purchases) return null;

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "Id", field: "id", hidden: true },
          { title: "Date", field: "date", type: "date" },
          {
            title: "Medication",
            field: "medicationId",
            type: "numeric",
            lookup: Object.fromEntries(
              medications.map((medication) => [
                medication.id,
                medication.brandName
              ])
            )
          } /* 
          {
            title: "Medication Name",
            field: "medication.brandName",
            editable: "never"
          }, */,
          { title: "Qty", field: "quantity", type: "numeric" }
        ]}
        editable={{
          onRowAdd: (newData) => props.db.purchases.add(newData),
          onRowUpdate: (newData, oldData) =>
            props.db.purchases.update(oldData.id, {
              date: newData.date,
              medicationId: Number(newData.medicationId),
              quantity: newData.quantity
            }),
          onRowDelete: (oldData) => props.db.purchases.delete(oldData.id)
        }}
        data={purchases}
        title={"Purchases"}
      />
    </div>
  );
}
