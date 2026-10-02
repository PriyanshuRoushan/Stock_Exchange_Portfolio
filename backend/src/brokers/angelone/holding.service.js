import axios from "axios";
import { getAngelApiHeaders } from "./auth.service.js";

export const fetchAngelOneHoldings = async (accessToken) => {
    try {
        const response = await axios.get(
            "https://apiconnect.angelone.in/rest/secure/angelbroking/portfolio/v1/getAllHolding",
            { headers: getAngelApiHeaders(accessToken) }
        );
        return response.data?.data?.holdings || [];
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Unable to fetch Angel One holdings: ${message}`);
    }
};
