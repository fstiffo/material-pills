import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";

export default function Home(props) {
  const classes = props.classes;
  return (
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
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
        Quickly take control of your supply of pills.
      </Typography>
    </Container>
  );
}
