import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { Payload } from './Templates'


type TCampaign = {
    id: number
    name: string
    rows: []
}


const Campaign = () => {
    const [campaigns, setCampaigns] = useState<TCampaign[]>([]);
    const [userId, setUserId] = useState<number>();
    const [file, setFile] = useState<File | null>(null);
    const [jwt, setJwt] = useState<string | null>(null);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        async function fetchTemplates(user_id: number) {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/campaign?user_id=${user_id}`);
            setCampaigns(res.data);
        }
        const jwt = localStorage.getItem('jwt');
        setJwt(jwt);

        if (jwt) {
            const decoded: Payload = jwtDecode(jwt);
            setUserId(decoded.user_id);
            fetchTemplates(decoded.user_id);
        }
    }, [setCampaigns, setUserId, setJwt]);

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            console.log("File is not valid");
        }
    };

    const handleSheetUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (file) {
            console.log("File Uploaded: ", file);
            setFile(null);
        } else {
            alert("Please upload a file");
        }

        try {
            const formData = new FormData();
            if (file) {
                formData.append("sheet", file, file.name);
                formData.append("name", name)
            }

            console.log(formData);

            const res =
                await axios.post(`
                ${import.meta.env.VITE_SERVER}/campaign?user_id=${userId}`,
                    formData, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
                );

            console.log("file success", res.data);
        } catch (error) {
            console.log("error uploading: ", error);
        }
    };



    return (
        <div className="campaign-container">

            {campaigns.length > 0 ? (
                <div className="saved-campaigns">
                    <h1>Saved Campaigns</h1>
                    {campaigns.map((c, i) => {
                        return (
                            <p className='campaign-item' key={c.id} id={c.id.toString()}>
                                {`${i + 1}. ${c.name}`}
                            </p>
                        );
                    })}
                </div>
            ) : (
                <div className="saved-campaigns">
                    <RotatingLines />
                </div>
            )}

            <form method="post" onSubmit={handleSheetUpload}>
                <h1>Upload Excel Sheet</h1>
                <br />

                <div className="form-fields">
                    <label htmlFor='name'>Name of this Campaign</label>
                    <input
                        type="text" id="name"
                        placeholder='Software Recruiters'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <br />

                    <label htmlFor='sheet'>Choose .xlsx file</label>
                    <input
                        type="file"
                        name="sheet"
                        id="sheet"
                        accept='.xlsx'
                        onChange={handleFile}
                    />
                    <br />

                    <button type="submit">Upload</button>
                </div>
            </form>
        </div>
    )
}

export default Campaign;
