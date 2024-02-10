import './styles/style.css';
import { RefObject, useEffect, useRef, useState } from "react";
import { Payload, Template } from "./Templates";
import { fetchCampaigns, fetchTemplates, startSendingEmails } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { TCampaign } from "./Campaign";
import { RotatingLines } from "react-loader-spinner";


const Mail = () => {
  const templateRef: RefObject<HTMLParagraphElement> = useRef(null);
  const receiverRef: RefObject<HTMLParagraphElement> = useRef(null);

  const [userId, setUserId] = useState<number>();
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [campaigns, setCampaigns] = useState<TCampaign[] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [campaignStarted, setCampaignStarted] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem('jwt');

      if (jwt) {
        const decoded: Payload = jwtDecode(jwt);
        setUserId(decoded.user_id);

        const tmps = await fetchTemplates(decoded.user_id);
        setTemplates(tmps);

        const res = await fetchCampaigns(decoded.user_id);
        setCampaigns(res);
      }
    };

    fetchData();
  }, [setUserId]);


  return (
    <div className="start-mails-container">
      <form method="post">
        <h1>Start Sending Emails</h1>
        <br />

        <label>Selected Email Template</label>
        <p ref={templateRef}>
          {selectedTemplate !== null ? (
            templates?.find(t => t.id === selectedTemplate)?.subject || "Not Selected"
          ) : "Not Selected"
          }
        </p>
        <br />


        <label>Selected Receivers Sheet</label>
        <p ref={receiverRef}>
          {selectedCampaign !== null ? (
            campaigns?.find(c => c.id === selectedCampaign)?.name || "Not Selected"
          ) : "Not Selected"
          }
        </p>
        <br />

        <button type="button" onClick={async () => {
          if (userId && selectedCampaign && selectedTemplate) {
            const statusCode = await startSendingEmails(userId, selectedTemplate, selectedCampaign);
            if (statusCode === 201) setCampaignStarted(true);
          } else {
            alert("Do selection first.");
          }
        }}>
          Start Sending
        </button>
        <br />

        {campaignStarted && <h3 className='success-message'>
          Campaign Started Succesfully!
          <br />
          It will take some minutes to send all the emails
          <br />
          <br />
          More details on Dashboard.
        </h3>}
      </form>


      <div className="selectors">
        {templates === null ? (
          <div className="template-selector">
            <RotatingLines />
          </div>
        ) : (
          templates.length > 0 ? (
            <div className="template-selector">
              <h1>Choose Email Template</h1>
              {templates.map((t, i) => (
                <p
                  className='template-item'
                  key={t.id}
                  id={t.id.toString()}
                  onClick={(e) => {
                    const id = (e.target as HTMLUListElement).id;
                    setSelectedTemplate(parseInt(id));
                  }}
                >
                  {`${i + 1}. ${t.subject}`}
                </p>
              ))}
            </div>
          ) : (
            <div className="template-selector">
              <p>Create New Template First to Starting Sending Emails</p>
            </div>
          )
        )}


        {campaigns === null ? (
          <div className="campaign-selector">
            <RotatingLines />
          </div>
        ) : (
          campaigns.length > 0 ? (
            <div className="campaign-selector">
              <h1>Choose Receivers Sheet</h1>
              {campaigns.map((c, i) => {
                return (
                  <p
                    className='campaign-item'
                    key={c.id}
                    id={c.id.toString()}
                    onClick={(e) => {
                      const id = (e.target as HTMLUListElement).id;
                      setSelectedCampaign(parseInt(id));
                    }}
                  >
                    {`${i + 1}. ${c.name}`}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="campaign-selector">
              <p>First, Create a New Campaign to Starting Sending Emails</p>
            </div>
          )
        )}
      </div>

    </div>
  )
}

export default Mail;
