import { useEffect, useState } from 'react';
import Editor from './Rte'
import { RotatingLines } from "react-loader-spinner";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { fetchTemplates } from '../services/api';

export interface Template {
    id: number
    subject: string
    body: string
    attachments: string
}

export interface Payload extends JwtPayload {
    user_id: number
}

const Templates = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [userId, setUserId] = useState<number>();
    const [bodyValue, setBodyValue] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const jwt = localStorage.getItem('jwt');

            if (jwt) {
                const decoded: Payload = jwtDecode(jwt);
                setUserId(decoded.user_id);
                const res = await fetchTemplates(decoded.user_id);
                setTemplates(res);
            }
        };

        fetchData();
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