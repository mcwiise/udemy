import { useNavigate } from "react-router";
import { Fragment } from "react"
import classes from './Modal.module.css'

function Modal({children}){
    
    const navigate = useNavigate();

    function onCloseHandler(){
        navigate('/');
    }

    return(
    <Fragment>
        <div className={classes.backdrop} onClick={onCloseHandler}></div>
        <dialog open className={classes.modal}>{children}</dialog>
    </Fragment>);
}

export default Modal