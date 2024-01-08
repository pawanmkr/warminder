import SignIn from "../Components/SignIn";
import Something from "../Components/Something";
import "./styles/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LandingPage = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="landing-page">
                <Something />
                <br />
                <SignIn />
            </div>
        </GoogleOAuthProvider>
    );
}

export default LandingPage;