import MaterialTable from "material-table";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";

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
        title={"Purchases"}
        columns={[
          { title: "Id", field: "id", hidden: true },
          {
            title: "Date",
            field: "date",
            type: "date",
            customSort: (a, b) =>
              dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
            defaultSort: "desc"
          },
          {
            title: "Medication",
            field: "medicationId",
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
          onRowAdd: (newData) =>
            props.db.purchases.add({
              date: newData.date,
              medicationId: Number(newData.medicationId),
              quantity: newData.quantity
            }),
          onRowUpdate: (newData, oldData) =>
            props.db.purchases.update(oldData.id, {
              date: newData.date,
              medicationId: Number(newData.medicationId),
              quantity: newData.quantity
            }),
          onRowDelete: (oldData) => props.db.purchases.delete(oldData.id)
        }}
        data={purchases}
        options={{ sorting: true, pageSize: 10 }}
      />
    </div>
  );
}
