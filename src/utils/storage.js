export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando en localStorage la clave ${key}:`, error);
  }
};

export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error leyendo de localStorage la clave ${key}:`, error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};