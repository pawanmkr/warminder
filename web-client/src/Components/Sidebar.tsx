import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "./styles/style.css";
import { Components } from "../Pages/Dashboard";

type User = {
    name: string;
    picture: string;
};

interface SidebarProps {
    components: Components;
    setCurrent: React.Dispatch<React.SetStateAction<ReactNode>>;
}

const Sidebar = ({ components, setCurrent }: SidebarProps) => {
    const [profile, setProfile] = useState<User>();

    function handleTabChange(e: React.MouseEvent<HTMLButtonElement>) {
        const id = (e.target as HTMLElement).id;
        setCurrent(components[id]);
    }

    useEffect(() => {
        async function fetchProfile() {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER}/auth/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    },
                );
                setProfile(res.data);
            } else {
                throw new Error("Failed to fetch user profile.");
            }
        }
        fetchProfile();
    }, [setProfile]);

    return (
        <div className="sidebar">
            <div className="profile">
                {profile !== undefined ? (
                    <>
                        <img src={profile.picture} />
                        <div className="info">
                            <p className="name">{profile.name}</p>
                            <p className="credits">Credits: 180</p>
                        </div>
                    </>
                ) : (
                    <RotatingLines />
                )}
            </div>
            <hr />

            <div className="menus">
                <div className="up">
                    <button
                        id="stats"
                        onClick={handleTabChange}
                        className="dashboard menu-option"
                    >
                        Dashboard
                    </button>
                    <button
                        id="campaigns"
                        onClick={handleTabChange}
                        className="campaigns menu-option"
                    >
                        Campaigns
                    </button>
                    <button
                        id="templates"
                        onClick={handleTabChange}
                        className="templates menu-option"
                    >
                        Templates
                    </button>
                    <button onClick={handleTabChange} className="send-mails menu-option">
                        Send Mails
                    </button>
                    <button onClick={handleTabChange} className="my-list menu-option">
                        My Lists
                    </button>
                </div>
                <div className="bottom">
                    <button
                        onClick={handleTabChange}
                        className="settings menu-option last-option"
                    >
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

