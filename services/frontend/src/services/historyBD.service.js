import axios from "axios";

// Obtener todos los ítems
export const fetchHistoryItems = async () => {
  try {
    const response = await axios.get("api/order/history-records");

    if (response.status != 200) {
      throw new Error("Error al obtener los datos");
    }
    return await response.data;
  } catch (error) {
    console.error("Error en fetchItems:", error);
    return [];
  }
};

// Obtener la cantidad de registros
export const fetchHistoryItemCount = async () => {
  try {
    const response = await axios.get("api/order/history");
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.data; // Suponiendo que el backend responde con { count: 10 }
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};

export const deleteAllHistory = async () => {
  try {
    const response = await axios.delete("api/order/delete-history");
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.message;
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};


export const fetchStatusItems = async () => {
  try {
    const response = await axios.get("api/order/status-records");

    if (response.status != 200) {
      throw new Error("Error al obtener los datos");
    }
    return await response.data;
  } catch (error) {
    console.error("Error en fetchItems:", error);
    return [];
  }
};

// Obtener la cantidad de registros
export const fetchStatusItemCount = async () => {
  try {
    const response = await axios.get("api/order/status");
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.data; // Suponiendo que el backend responde con { count: 10 }
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};

export const deleteAllStatus = async () => {
  try {
    const response = await axios.delete("api/order/delete-status");
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.message;
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};

