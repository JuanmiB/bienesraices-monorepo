import axios from "axios";

const getAddress = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    try {
        const response = await axios.get(url);
        if (response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch {
        return null;
    }
};

export default getAddress;