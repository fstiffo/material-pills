import MaterialTable from "material-table";
import { useLiveQuery } from "dexie-react-hooks";

export default function PurchasesTable(props) {
  const purchases = useLiveQuery(
    () => props.db.purchases.with({ medication: "medicationId" }),
    []
  );
  if (!purchases) return null;

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "Id", field: "id", hidden: true },
          { title: "Date", field: "date", type: "date" },
          { title: "Medication ID", field: "medicationId", type: "numeric" },
          {
            title: "Medication Name",
            field: "medication.brandName",
            editable: "never"
          },
          { title: "Qty", field: "quantity", type: "numeric" }
        ]}
        editable={{
          onRowAdd: (newData) => props.db.purchases.add(newData),
          onRowUpdate: (newData, oldData) =>
            props.db.purchases.update(oldData.id, newData),
          onRowDelete: (oldData) => props.db.purchases.delete(oldData.id)
        }}
        data={purchases}
        title={"Purchases"}
      />
    </div>
  );
}
