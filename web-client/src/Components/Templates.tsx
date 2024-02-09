import { useEffect, useState } from 'react';
import Editor from './Rte'
import { RotatingLines } from "react-loader-spinner";
import axios from 'axios';
import { JwtPayload, jwtDecode } from 'jwt-decode';

export interface Template {
    id: number
    subject: string
    body: string
    attachments: string
}

interface Payload extends JwtPayload {
    user_id: number
}

const Templates = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [userId, setUserId] = useState<number>();
    const [bodyValue, setBodyValue] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        async function fetchTemplates(user_id: number) {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/templates?user_id=${user_id}`);
            setTemplates(res.data);
        }
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            const decoded: Payload = jwtDecode(jwt);
            setUserId(decoded.user_id);
            fetchTemplates(decoded.user_id);
        }
    }, [setTemplates, setUserId]);

    return (
        <div className='templates-container'>

            <Editor
                setTemplates={setTemplates}
                userId={userId}
                bodyValue={bodyValue}
                setBodyValue={setBodyValue}
                subject={subject}
                setSubject={setSubject}
            />

            {templates.length > 0 ? (
                <div className="templates">
                    <h1>Saved Templates</h1>

                    {templates.map((t, i) => {
                        return <p
                            className='template-item'
                            key={t.id}
                            id={t.id.toString()}
                            onClick={async (e) => {
                                const id = (e.target as HTMLUListElement).id;
                                const tmp = templates.find(t => t.id == parseInt(id));
                                if (tmp) {
                                    setSubject(tmp.subject);
                                    setBodyValue(tmp.body);
                                }
                            }}>
                            {`${i + 1}. ${t.subject}`}
                        </p>
                    })}
                </div>
            ) : (
                <div className="templates">
                    <RotatingLines />
                </div>
            )}
        </div>
    )
};

export default Templates;