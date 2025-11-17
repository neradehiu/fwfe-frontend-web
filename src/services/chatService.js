import api from "./api";

const token = localStorage.getItem("token");

export const getPrivateChatHistory = async (user, limit = 50) => {
  const res = await api.get(
    `/chat/chat/history/private?user=${user}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getPrivateInbox = async (myUsername) => {
  const res = await api.get(
    `/chat/chat/private/inbox?myUsername=${myUsername}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const markMessageAsRead = async (id) => {
  const res = await api.put(
    `/chat/mark-read/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getReceivedMessages = async () => {
  const res = await api.get("/chat/received", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
