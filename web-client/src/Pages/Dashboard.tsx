import { useState, ReactNode } from 'react';
import DashboardStats from '../Components/DashboardStats';
import Sidebar from '../Components/Sidebar';
import Companies from '../Components/companies/Companies';
import "./styles/style.css";
import ContributionForm from '../Components/companies/ContributionForm';

// Define a type for your components object
export type Components = {
    [key: string]: ReactNode;
};

const Dashboard = () => {
    const components: Components = {
        "stats": <DashboardStats />,
        "companies": <Companies />,
        "contribution-form": <ContributionForm />
    }

    // Use the Components type for the state
    const [current, setCurrent] = useState<ReactNode>(components["stats"]);

    return (
        <div className="dashboard-page">
            <Sidebar components={components} setCurrent={setCurrent} />
            {current}
        </div>
    )
}

export default Dashboard;
