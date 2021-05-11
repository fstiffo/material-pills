import MaterialTable from "material-table";
import { useLiveQuery } from "dexie-react-hooks";

export default function PrescriptionsTable(props) {
  const prescriptions = useLiveQuery(
    () => props.db.prescriptions.toArray(),
    []
  );
  if (!prescriptions) return null;

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "Id", field: "id", hidden: true },
          { title: "Drug", field: "drugName" },
          { title: "Dose Strenght", field: "dose", type: "numeric" },
          { title: "Dose Unity", field: "unity" },
          { title: "Every # day(s)", field: "days", type: "numeric" }
        ]}
        editable={{
          onRowAdd: (newData) => props.db.prescriptions.add(newData),
          onRowUpdate: (newData, oldData) =>
            props.db.prescriptions.update(oldData.id, newData),
          onRowDelete: (oldData) => props.db.prescriptions.delete(oldData.id)
        }}
        data={prescriptions}
        title={"Prescriptions"}
      />
    </div>
  );
}
