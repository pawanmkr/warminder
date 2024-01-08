import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "./styles/style.css";

type User = {
    name: string,
    picture: string
}

const Sidebar = () => {
    const [profile, setProfile] = useState<User>();

    useEffect(() => {
        async function fetchProfile() {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const res = await axios
                    .get(`${import.meta.env.VITE_SERVER}/auth/user`, {
                        headers: {
                            'Authorization': `Bearer ${jwt}`
                        }
                    });
                setProfile(res.data);
            } else {
                throw new Error("Failed to fetch user profile.");
            }
        }
        fetchProfile();
    }, [setProfile])

    return (
        <div className="sidebar" >
            {profile !== undefined ? (
                <div className="profile">
                    <img src={profile.picture} />
                    <div className="info">
                        <p className="name">{profile.name}</p>
                        <p className="credits">Credits: 180</p>
                    </div>
                </div>
            ) : (
                <RotatingLines />
            )}
            <div className="menus">
                <div className="up">
                    <p className="dashboard menu-option">Dashboard</p>
                    <p className="Companies menu-option">Companies</p>
                    <p className="send-mails menu-option">Send Mails</p>
                    <p className="my-list menu-option">My Lists</p>
                </div>
                <div className="bottom">
                    <p className="settings menu-option last-option">Settings</p>
                </div>
            </div>
        </div >
    )
}

export default Sidebar;