import classes from "./MainContent.module.css";
import OAuthLogin from "./OAuthLogin.jsx";

function MainContent() {
  return (
    <section className={classes.mainContent}>
      <OAuthLogin />
    </section>
  );
}

export default MainContent;
