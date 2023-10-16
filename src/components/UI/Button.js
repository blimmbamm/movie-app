import { Link } from "react-router-dom";
import classes from "./Button.module.css";

function Button ({children, type, onClick, to}) {
    switch (type) {
        case "link":
            return <Link to={to} className={classes.button}>{children}</Link>  
        default:
            return <button className={classes.button} onClick={onClick}>{children}</button>;
    }    
}


export default Button;