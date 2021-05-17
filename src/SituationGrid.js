import { useLiveQuery } from "dexie-react-hooks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WarningRounded from "@material-ui/icons/WarningRounded";

import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/advancedFormat"; // load on demand

dayjs.extend(AdvancedFormat); // use plugin

export default function SituationGrid(props) {
  const classes = props.classes;

  const prescription = props.prescription;
  const dosage = `${prescription.dose} ${prescription.unity}${` every ${
    prescription.days < 2 ? "day" : `${prescription.days} days`
  }`}`;

  // Find purchases of medications with the prescribed drug
  const purchases = useLiveQuery(
    () =>
      props.db.medications
        .where("name")
        .equals(prescription.drugName)
        .toArray()
        .then((medications) =>
          props.db.purchases
            .where("medicationId")
            .anyOf(medications.map((m) => m.id))
            .with({ medication: "medicationId" })
        ),
    []
  );

  if (!purchases) return null;
  console.log(purchases);
  purchases.sort((b, a) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  const firstPurchase = purchases.slice(-1)[0];
  const daysFromFirstPurchase =
    purchases.length > 0 ? dayjs().diff(dayjs(firstPurchase.date), "day") : 0;
  const purchasedDoses =
    purchases.length > 0
      ? Math.floor(
          purchases
            .map(
              (p) => p.medication.strength * p.medication.quantity * p.quantity
            )
            .reduce((a, b) => a + b) / prescription.dose
        )
      : 0;
  const consumedDoses = Math.floor(daysFromFirstPurchase / prescription.days);
  const daysLeft = (purchasedDoses - consumedDoses) * prescription.days;
  const alert = daysLeft < 8;

  return (
    <Grid
      item
      key={prescription.id}
      xs={12}
      //sm={tier.title === "Enterprise" ? 12 : 6}
      md={4}
    >
      <Card>
        <CardHeader
          title={prescription.drugName}
          subheader={dosage}
          titleTypographyProps={{ align: "center" }}
          subheaderTypographyProps={{ align: "center" }}
          action={alert ? <WarningRounded style={{ fill: "red" }} /> : null}
          className={classes.cardHeader}
        />
        <CardContent>
          <div className={classes.cardPricing}>
            <Typography
              component="h2"
              variant="h4"
              color={alert ? "error" : "textPrimary"}
            >
              {`${daysLeft} days left`}
            </Typography>
            <Typography variant="h6" color={alert ? "error" : "textSecondary"}>
              /{purchasedDoses - consumedDoses} doses
            </Typography>
          </div>
          <Typography component="div" align="center">
            <ul>
              {purchases.slice(0, 3).map((purchase) => (
                <Typography
                  component="li"
                  variant="subtitle1"
                  align="left"
                  key={purchase.id}
                >
                  {`${dayjs(purchase.date).format("MM/DD/YYYY")} ${
                    purchase.quantity
                  } ${purchase.medication.brandName}`}
                </Typography>
              ))}
            </ul>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
