import classes from "./OAuthLogin.module.css";
import { Link } from "react-router-dom";

function OAuthLogin() {
  const faceAuthzEndpoint =
    "https://www.facebook.com/v10.0/dialog/oauth?client_id=1369942260248009&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fhome&state=80";
  return (
    <div className={classes.row}>
      <div className={classes.loginForm}>
        <header className={classes.loginHeader}>
          <h1>Login</h1>
          <p>Choose the account you wish to login with:</p>
        </header>
        <div className={classes.loginActions}>
          <Link to={faceAuthzEndpoint} className={classes.loginAction}>
            Continue with Facebook
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OAuthLogin;
