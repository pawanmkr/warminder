import { CompanyData } from "./Companies"
import { IoLocationOutline } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import "../styles/style.css";

interface CompanyProps {
    comp: CompanyData
}

const Company = (props: CompanyProps) => {
    const { name, location, size, website } = props.comp;

    return (
        <div className="company">

            <div className="identity">
                <img src="https://pawanmkr.s3.ap-south-1.amazonaws.com/Screenshot+2024-01-02+at+2.07.26%E2%80%AFPM.png" />
                <div className="details">
                    <div className="up">
                        <p className="name">{name}</p>
                        <div className="location-size">
                            <p className="location">
                                <IoLocationOutline />
                                <span>{location}</span>
                            </p>
                            <p className="size">
                                <HiUsers />
                                <span>{size}</span>
                            </p>
                        </div>
                    </div>
                    <a href={website} target="_blank" className="website">{website}</a>
                </div>
            </div>

            <div className="details">
                <div className="roles">
                    <label>Roles</label>
                    <p>
                        <span>SDE</span>
                        <span>Database Engineer</span>
                        <span>Marketing Expert</span>
                        <span>Hiring Manager</span>
                    </p>
                </div>
                <div className="skills">
                    <label>Skill Requirements</label>
                    <p>
                        <span>Java</span>
                        <span>Spring Boot</span>
                        <span>Databases</span>
                        <span>Hadoop</span>
                        <span>Python</span>
                        <span>Neural Networks</span>
                        <span>Researcher</span>
                        <span>Systems Engineer</span>
                        <span>Angular</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Company;