import { CompanyData } from "./Companies"
import { IoLocationOutline } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import "../styles/style.css";

interface CompanyProps {
    comp: CompanyData
}

const Company = (props: CompanyProps) => {
    const { name, location, size, website, picture, roles, skills } = props.comp;

    return (
        <div className="company">

            <div className="identity">
                <img src={picture} />
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
                    {roles.length > 0 && (
                        <>
                            <label>Roles</label>
                            <p>
                                {roles.map((r) => {
                                    return <span>{r}</span>
                                })}
                            </p>
                        </>
                    )}
                </div>
                <div className="skills">
                    {skills.length > 0 && (
                        <>
                            <label>Skill Requirements</label>
                            <p>
                                {skills.map((s) => {
                                    return <span>{s}</span>
                                })}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Company;