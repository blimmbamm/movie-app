import classes from "./Footer.module.css";

function Footer() {
  return (
    <footer className={classes.container}>
      <Item text="Some footer content"/>
      <Item text="Some other footer content"/>
    </footer>
  );
}

function Item({text}){
    return <div className={classes.item}>{text}</div>
}

export default Footer;
