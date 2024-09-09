import { Button } from "react-bootstrap";
import styleUtils from '../styles/utils.module.css'

interface NavBarLoggedOutViewProps{
    onSignUpClicked:()=>void,
    onLogInClicked:()=>void,

}

const NavBarLoggedOutView = ({onSignUpClicked,onLogInClicked}:NavBarLoggedOutViewProps) => {
    return (
        <>
            <Button onClick={onSignUpClicked} className={styleUtils.logs}>
                Sign Up
            </Button>
            <Button onClick={onLogInClicked} className={styleUtils.logs}>
                Log In
            </Button>
        </>
    );
}
 
export default NavBarLoggedOutView;