import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import Company from "./Company";
import "../styles/style.css";
import SearchBox from "../SearchBox";

export type CompanyData = {
    id: number
    name: string
    location: string
    size: string
    website: string
    picture: string
    skills: string[]
    roles: string[]
}

const Companies = () => {
    const [companies, setCompanies] = useState<CompanyData[]>();

    useEffect(() => {
        async function fetchCompanies() {
            const jwt = localStorage.getItem("jwt");
            if (jwt) {
                const res = await axios
                    .get(`${import.meta.env.VITE_SERVER}/company/list`);
                setCompanies(res.data);
                console.log(res.data);
            } else {
                throw new Error("Failed to fetch Companies.");
            }
        }
        fetchCompanies();
    }, [setCompanies])

    return (
        <div className="companies">
            <div className="up">
                <SearchBox />
                <button className="contribute-btn">
                    <IoMdAdd />
                    <span>Contribute</span>
                </button>
            </div>

            <hr />

            {companies ? (
                <div className="list">
                    {companies.map((c) => {
                        return <Company key={c.id} comp={c} />
                    })}
                </div>
            ) : (
                <div className="loading">
                    <RotatingLines />
                </div>
            )}
        </div>
    )
}

export default Companies;
