import axios from "axios";

const server = import.meta.env.VITE_SERVER as string;

export async function fetchTemplates(user_id: number) {
  const res = await axios.get(`${server}/templates?user_id=${user_id}`);
  return res.data;
}

export async function fetchCampaigns(user_id: number) {
  const res = await axios.get(`${server}/campaign?user_id=${user_id}`);
  return res.data;
}

export async function startSendingEmails(userId: number, template_id: number, sheet_id: number) {
  const res =
    await axios.post(`
        ${server}/campaign/start?user_id=${userId}&template_id=${template_id}&sheet_id=${sheet_id}`
    );

  return res.status;
}