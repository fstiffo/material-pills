import { useLiveQuery } from "dexie-react-hooks";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

export default function SituationGrid(props) {
  const classes = props.classes;

  const prescription = props.prescription;
  const dosage = `${prescription.dose} ${prescription.unity}${` every ${
    prescription.days < 2 ? "day" : `${prescription.days} days`
  }`}`;
  console.log(prescription);
  const medications = useLiveQuery(() => props.db.medications.toArray(), []);
  if (!medications) return null;

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
          //action={tier.title === "Pro" ? <StarIcon /> : null}
          className={classes.cardHeader}
        />
        <CardContent>
          <div className={classes.cardPricing}>
            <Typography component="h2" variant="h3" color="textPrimary">
              ${"tier.price"}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              /mo
            </Typography>
          </div>
          <ul>
            {["line 1", "line 2", "line 3"].map((line) => (
              <Typography
                component="li"
                variant="subtitle1"
                align="center"
                key={line}
              >
                {line}
              </Typography>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <Button fullWidth variant={"contained"} color="primary">
            {"tier.buttonText"}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
