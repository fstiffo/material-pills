import MaterialTable from "material-table";
import { useLiveQuery } from "dexie-react-hooks";

export default function MedicationsTable(props) {
  const medications = useLiveQuery(() => props.db.medications.toArray(), []);
  if (!medications) return null;

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "Id", field: "id", hidden: true },
          { title: "Brand Name", field: "brandName", defaultSort: "asc" },
          { title: "Manufacturer", field: "manufacturer" },
          { title: "Drug Name", field: "name" },
          { title: "Strength", field: "strength", type: "numeric" },
          { title: "Unity", field: "unity" },
          { title: "Qty", field: "quantity", type: "numeric" }
        ]}        
        editable={{
          onRowAdd: (newData) => props.db.medications.add(newData),
          onRowUpdate: (newData, oldData) =>
            props.db.medications.update(oldData.id, newData),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              props.db.purchases
                .get({ medicationId: oldData.id })
                .then((result) => {
                  console.log(result);
                  if (!result) resolve(props.db.medications.delete(oldData.id));
                  else {
                    alert(
                      `Sorry is it impossibile to delete ${oldData.brandName}, there is a purchase that references this medication!`
                    );
                    resolve();
                  }
                });
            })
        }}
        data={medications}
        title={"Medications"}
        options={{pageSize: 10}}
      />
    </div>
  );
}
