import './styles/style.css';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';


function Editor() {
    const [value, setValue] = useState('');
    const [subject, setSubject] = useState('');

    return (
        <div className='editor-form'>
            <h1>Create new Email Template</h1>

            <form onSubmit={async (e) => {
                e.preventDefault();
                const data = {
                    subject: subject,
                    body: value
                };

                setValue('');
                setSubject('');

                const res =
                    await axios.post(`${import.meta.env.VITE_SERVER}/template`, data);

                if (res.status == 201) {
                    console.log(res.status);
                    // do actions when template is saved
                }
            }}>
                <label>Subject</label>
                <input
                    className='subject'
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder='Application for Software Engineer'
                    onChange={(e) => {
                        setSubject(e.target.value);
                    }}
                />
                <br />

                <label>Body</label>
                <ReactQuill
                    className='editor'
                    theme="snow"
                    value={value}
                    onChange={setValue}
                />
                <br />
                <button type="submit">Save Template</button>
            </form>
        </div>
    );
}

export default Editor;
