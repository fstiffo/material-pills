//import "./styles.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Icon from "@material-ui/core/Icon";
import Dexie from "dexie";
import relationships from "dexie-relationships";
import dayjs from "dayjs";
import MedicationsTable from "./MedicationsTable";
import PrescriptionsTable from "./PrescriptionsTable";
import PurchasesTable from "./PurchasesTable";
import Home from "./Home";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
}));

const db = new Dexie("PILLS_DB", { addons: [relationships] });

db.version(2).stores({
  medications: "++id,&[brandName+strength+unity+quantity], name, manufacturer",
  prescriptions: "++id, &[drugName+dose+unity], days",
  purchases: "++id, medicationId -> medications.id, quantity, date"
});

db.transaction("rw", db.medications, db.prescriptions, db.purchases, () => {
  // Medications
  // db.medications.clear();
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
  // db.prescriptions.clear();
  db.prescriptions.count().then((count) => {
    if (count === 0) {
      db.prescriptions.bulkPut([
        { drugName: "aspirina", dose: 100, unity: "mg", days: 1 },
        { drugName: "paracetamolo", dose: 500, unity: "mg", days: 7 }
      ]);
    }
  });
  // Purchases
  // db.purchases.clear();
  db.purchases.count().then((count) => {
    if (count === 0) {
      db.purchases.bulkPut([
        { medicationId: 11, quantity: 1, date: dayjs().format() },
        { medicationId: 12, quantity: 3, date: dayjs().format() }
      ]);
    }
  });
});

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
           
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            > <Icon color="primary" style={{ fontSize: "1.2em" }}>scatter_plot</Icon>
              Pills
            </Typography>
            <nav>
              <Link
                variant="button"
                color="textPrimary"
                href="/medications"
                className={classes.link}
              >
                Medications
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/prescriptions"
                className={classes.link}
              >
                Prescriptions
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/purchases"
                className={classes.link}
              >
                Purchases
              </Link>
            </nav>
            <Route exact path={["/medications", "/prescriptions", "/purchases"]}>
              <Button
                href="/"
                color="primary"
                variant="outlined"
                className={classes.link}
              >
                Back
              </Button>
            </Route>
          </Toolbar>
        </AppBar>

        {/* End hero unit */}
        <Container maxWidth="md" component="main">
          <Switch>
            <Route path="/medications">
              <MedicationsTable db={db} />
            </Route>
            <Route path="/prescriptions">
              <PrescriptionsTable db={db} />
            </Route>
            <Route path="/purchases">
              <PurchasesTable db={db} />
            </Route>
            <Route path="/">
              <Home classes={classes} db={db}/>
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}
