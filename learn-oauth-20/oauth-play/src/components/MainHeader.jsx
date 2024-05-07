import classes from "./MainHeader.module.css";
import { BsFillGearFill, BsFillShieldLockFill } from "react-icons/bs";
import { Link } from "react-router-dom";

function MainHeader() {
  return (
    <header className={classes.header}>
      <nav className={classes.navBar}>
        <div className={classes.brand}>
          <Link className={classes.brand} to={"#"}>
            <BsFillShieldLockFill className={classes.icon} />
            <strong className={classes.legend}>Playground</strong>
          </Link>
        </div>
        <BsFillGearFill />
      </nav>
    </header>
  );
}

export default MainHeader;
