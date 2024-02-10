import { useState, ReactNode } from "react";
import DashboardStats from "../Components/DashboardStats";
import Sidebar from "../Components/Sidebar";
import "./styles/style.css";
import Campaign from "../Components/Campaign";
import Templates from "../Components/Templates";
import Mail from "../Components/Mail";

// Define a type for your components object
export type Components = {
    [key: string]: ReactNode;
};

const Dashboard = () => {
    const components: Components = {
        stats: <DashboardStats />,
        campaigns: <Campaign />,
        templates: <Templates />,
        mails: <Mail />
    };

    // Use the Components type for the state
    const [current, setCurrent] = useState<ReactNode>(components["stats"]);

    return (
        <div className="dashboard-page">
            <Sidebar components={components} setCurrent={setCurrent} />
            {current}
        </div>
    );
};

export default Dashboard;
