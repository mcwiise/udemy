import { useDispatch } from "react-redux";
import classes from "./Auth.module.css";
import { authActions } from "../store/auth.js";

const Auth = () => {
  const dispatch = useDispatch();
  const loginHandler = (event) => {
    console.log("po aca");
    event.preventDefault();
    dispatch(authActions.login());
  };

  return (
    <main className={classes.auth}>
      <section>
        <form onSubmit={loginHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input type="text" id="password" />
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  );
};

export default Auth;
