import SignIn from "../Components/SignIn";
import Something from "../Components/Something";
import "./style.css";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Something />
            <br />
            <SignIn />
        </div>
    );
}

export default LandingPage;