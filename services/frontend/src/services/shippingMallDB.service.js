import axios from "axios";

export const fetchTripsItems = async () => {
  try {
    const response = await axios.get(
      "mall/supply/trips-records"
    );

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
export const fetchTripsItemCount = async () => {
  try {
    const response = await axios.get(
      "mall/supply/trips"
    );
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.data; // Suponiendo que el backend responde con { count: 10 }
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};

export const deleteAlltrips = async () => {
  try {
    const response = await axios.delete(
      "mall/supply/delete-trips"
    );
    if (response.status != 200) {
      throw new Error("Error al obtener la cantidad de registros");
    }
    return response.message;
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};
