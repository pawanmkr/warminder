import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import "../Components/styles/style.css";

const SignIn = () => {
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            const res =
                await axios.post(
                    `${import.meta.env.VITE_SERVER}/auth/sign-in/google`, {
                    code: codeResponse.code,
                });
            
            localStorage.setItem("jwt", res.data)
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <button className="sign-in-btn" onClick={() => googleLogin()}>
            <FcGoogle />
            <p>SignIn With Google</p>
        </button>
    )
}

export default SignIn;
