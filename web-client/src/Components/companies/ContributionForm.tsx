

const ContributionForm = () => {
    return (
        <form className="contribution-form" onSubmit={(e) => {
            e.preventDefault();
            console.log("Form Submitted.");
        }}>
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
                    <label>Name</label>
                    <input type="text" required />
                </div>
                <div className="input">
                    <label>Location</label>
                    <input type="text" required placeholder="Ex. New Delhi, India" />
                </div>
                <div className="input">
                    <label>No. of Employees</label>
                    <select required>
                        <option value="1-10">1-10</option>
                        <option selected value="11-50">11-50</option>
                        <option value="51-250">51-200</option>
                        <option value="251-500">251-500</option>
                        <option value="500+">500+</option>
                    </select>
                </div>
                <div className="input">
                    <label>Website</label>
                    <input type="text" required />
                </div>
                <div className="input">
                    <label>Skills Requirements(Min. 4)</label>
                    <input type="text" required placeholder="Ex. Java,Spring Boot,Agile" />
                </div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}

export default ContributionForm;
