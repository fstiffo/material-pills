import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import SituationGrid from "./SituationGrid";
import { useLiveQuery } from "dexie-react-hooks";

export default function Home(props) {
  const classes = props.classes;
  const prescriptions = useLiveQuery(
    () => props.db.prescriptions.toArray(),
    []
  );
  if (!prescriptions) return null;

  return (
    <div>
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
          style={{fontFamily: "Pattaya"}}
        >
          <Icon style={{ fontSize: "1em" }} color="primary">
            scatter_plot
          </Icon>
          Pills
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Quickly take control of your supply of pills
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
        {prescriptions.map((prescription) => 
        <SituationGrid db={props.db} classes={classes} prescription={prescription}/>)}
        </Grid>
      </Container>
    </div>
  );
}
