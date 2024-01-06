import { FcGoogle } from "react-icons/fc";
import "../Components/styles/style.css";

const SignIn = () => {
    return (
        <button className="sign-in-btn">
            <FcGoogle />
            <p>SignIn With Google</p>
        </button>
    )
}

export default SignIn;