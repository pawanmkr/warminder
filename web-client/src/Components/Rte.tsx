import './styles/style.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { Template } from './Templates';


interface EditorProps {
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
    setBodyValue: React.Dispatch<React.SetStateAction<string>>
    setSubject: React.Dispatch<React.SetStateAction<string>>
    subject: string
    bodyValue: string
    userId: number | undefined
}


function Editor({ setTemplates, userId, bodyValue, setBodyValue, subject, setSubject }: EditorProps) {
    return (
        <div className='editor-form'>
            <h1>Create new Email Template</h1>

            <form onSubmit={async (e) => {
                e.preventDefault();

                if (!userId) {
                    console.log("UserId is " + userId + " :returning...");
                    return;
                }

                const data = {
                    subject: subject,
                    body: bodyValue
                };

                setBodyValue('');
                setSubject('');

                const res =
                    await axios.post(`${import.meta.env.VITE_SERVER}/templates?user_id=${userId}`, data);

                if (res.status == 201) {
                    setTemplates(prev => [...prev, res.data]);
                }
            }}>
                <label>Subject</label>
                <input
                    className='subject'
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder='Application for Software Engineer'
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value);
                    }}
                />
                <br />

                <label>Body</label>
                <ReactQuill
                    className='editor'
                    theme="snow"
                    value={bodyValue}
                    onChange={setBodyValue}
                />
                <br />
                <button type="submit">Save Template</button>
            </form>
        </div>
    );
}

export default Editor;
