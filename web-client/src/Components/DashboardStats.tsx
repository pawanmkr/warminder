import "./styles/style.css";

const DashboardStats = () => {
    return (
        <div className="dashboard-stats">
            <div className="campaign">
                <p className="title">Campaign</p>
                <div className="data">
                    <div className="numbers">
                        <label>Sent</label>
                        <p className="sent">100</p>
                    </div>
                    <div className="numbers">
                        <label>Replies</label>
                        <p className="replies">45</p>
                    </div>
                </div>
            </div>
            <div className="contribution">
                <p className="title">Contribution</p>
                <div className="data">
                    <div className="numbers">
                        <label>Credits</label>
                        <p className="credits">180</p>
                    </div>
                    <div className="numbers">
                        <label>Submissions</label>
                        <p className="count">37</p>
                    </div>
                    <div className="numbers">
                        <label>Accepted</label>
                        <p className="accepted">18</p>
                    </div>
                    <div className="numbers">
                        <label>Pending</label>
                        <p className="pending">10</p>
                    </div>
                    <div className="numbers">
                        <label>Rejected</label>
                        <p className="rejected">9</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats;