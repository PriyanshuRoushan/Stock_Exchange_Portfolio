import axios from "axios";
import { getAngelApiHeaders } from "./auth.service.js";

const BASE_URL = "https://apiconnect.angelone.in";

const get = async (accessToken, path, label) => {
    try {
        const response = await axios.get(`${BASE_URL}${path}`, {
            headers: getAngelApiHeaders(accessToken),
        });
        return response.data?.data ?? response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        const wrapped = new Error(`Unable to fetch Angel One ${label}: ${message}`);
        wrapped.status = error.response?.status;
        throw wrapped;
    }
};

export const fetchAngelOnePositions = (accessToken) =>
    get(accessToken, "/rest/secure/angelbroking/order/v1/getPosition", "positions");

export const fetchAngelOneOrders = (accessToken) =>
    get(accessToken, "/rest/secure/angelbroking/order/v1/getOrderBook", "orders");

export const fetchAngelOneFunds = (accessToken) =>
    get(accessToken, "/rest/secure/angelbroking/user/v1/getRMS", "funds and margin");
