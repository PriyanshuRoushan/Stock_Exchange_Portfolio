import axios from "axios";

const getRequiredEnv = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} must be configured before connecting Angel One`);
    return value;
};

export const getAngelOneLoginUrl = (state) => {
    const params = new URLSearchParams({
        api_key: getRequiredEnv("ANGEL_API_KEY"),
        redirect_url: getRequiredEnv("ANGEL_REDIRECT_URI"),
        state,
    });

    return `https://smartapi.angelone.in/publisher-login?${params.toString()}`;
};

export const getAngelApiHeaders = (accessToken) => ({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-ClientLocalIP": getRequiredEnv("ANGEL_CLIENT_LOCAL_IP"),
    "X-ClientPublicIP": getRequiredEnv("ANGEL_CLIENT_PUBLIC_IP"),
    "X-MACAddress": getRequiredEnv("ANGEL_MAC_ADDRESS"),
    "X-PrivateKey": getRequiredEnv("ANGEL_API_KEY"),
});

export const fetchAngelOneProfile = async (accessToken) => {
    try {
        const response = await axios.get(
            "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile",
            { headers: getAngelApiHeaders(accessToken) }
        );
        return response.data?.data ?? response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Unable to fetch Angel One profile: ${message}`);
    }
};
