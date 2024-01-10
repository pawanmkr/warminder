import axios from "axios";
import { useState } from "react";

const ContributionForm = () => {
    const [size, setSize] = useState("251-500");

    async function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        form.append("size", size);


        await axios.post(`${import.meta.env.VITE_SERVER}/company/contribute`,
            form, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }
        );

        window.alert("Submission Successfull!");
    }

    function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSize(e.target.value);
    }

    return (
        <form method="post" className="contribution-form" onSubmit={handleSubmission}>
            <p className="heading">Add a Company</p>
            <p className="instructions">
                *Please fill the Correct Information only.
                <br />
                The Request won't be accepted, If something is misleading or incorrect.
                <br />
                <br />
                The Information will be verified by the team manually under 48hrs and upon successfull submission,
                You wil be awarded with 10 Credits in you account, which you can utilize to send cold mails with <span>warminder</span>.
            </p>
            <div className="inputs">
                <div className="input">
                    <label>Company Logo</label>
                    <input type="file" name="picture" accept="image/png, image/jpeg" />
                </div>
                <div className="input">
                    <label>Name</label>
                    <input type="text" required name="name" />
                </div>
                <div className="input">
                    <label>Location</label>
                    <input type="text" required placeholder="Ex. New Delhi, India" name="location" />
                </div>
                <div className="input">
                    <label>Email Address</label>
                    <input type="email" name="email" />
                </div>
                <div className="input">
                    <label>No. of Employees</label>
                    <select required defaultValue={size} onChange={handleOptionChange} >
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-250">51-200</option>
                        <option value="251-500">251-500</option>
                        <option value="500+">500+</option>
                    </select>
                </div>
                <div className="input">
                    <label>Website</label>
                    <input type="text" required name="website" />
                </div>
                <div className="input">
                    <label>Roles they hire for</label>
                    <input type="text" required placeholder="Ex. SDE,Database Engineer" name="roles" />
                </div>
                <div className="input">
                    <label>Skills Requirements(Min. 4)</label>
                    <input type="text" required placeholder="Ex. Java,Spring Boot,Agile" name="skills" />
                </div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}

export default ContributionForm;
