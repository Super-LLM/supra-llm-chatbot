import { Chat, Message } from '../types';

// NOTE: The integration with Azure Functions requires the Static Web Apps STANDARD plan.

const createRequest = (chat: Chat) => {
  return fetch(import.meta.env.VITE_CREATE_NEW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chat),
  });
};

const readRequest = (userId: string) => {
  // console.log(import.meta.env.VITE_GET_CHAT_HISTORY_URL);
  return fetch(
    import.meta.env.VITE_GET_CHAT_HISTORY_URL +
      '&' +
      new URLSearchParams({ userId }).toString(),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

const updateRequest = (
  id: string,
  title: string | null,
  messages: Message[] | null
) => {
  let body = {};
  if (title != null) {
    body = { title };
  } else {
    body = { messages };
  }
  return fetch(
    import.meta.env.VITE_UPDATE_URL +
      '&' +
      new URLSearchParams({ id }).toString(),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
};

const deleteRequest = (id: string) => {
  return fetch(
    import.meta.env.VITE_DELETE_URL +
      '&' +
      new URLSearchParams({ id }).toString(),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export { createRequest, readRequest, updateRequest, deleteRequest };
