const API_KEY = import.meta.env.VITE_TICKETMASTER_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export const fetchFromApi = async (endpoint, params = {}) => {
  const query = new URLSearchParams({ apikey: API_KEY, ...params });
  const url = `${BASE_URL}${endpoint}?${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error de red al consumir la API:", error);
    throw error;
  }
};