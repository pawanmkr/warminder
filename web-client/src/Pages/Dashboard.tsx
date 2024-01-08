import DashboardStats from '../Components/DashboardStats';
import Sidebar from '../Components/Sidebar';
import "./styles/style.css";

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <Sidebar />
            <DashboardStats />
        </div>
    )
}

export default Dashboard;
