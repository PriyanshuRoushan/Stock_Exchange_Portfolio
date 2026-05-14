import axios from "axios";

// Step 1: Generate Login URL
export const getUpstockLoginUrl = () => {
    return `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;
};

// Step 2: Exchange Authorization Code for Access Token
export const exchangeUpstockCode = async (code) => {

    const params = new URLSearchParams();

    params.append("code", code);

    params.append(
        "client_id",
        process.env.UPSTOX_API_KEY
    );

    params.append(
        "client_secret",
        process.env.UPSTOX_API_SECRET
    );

    params.append(
        "redirect_uri",
        process.env.UPSTOX_REDIRECT_URI
    );

    params.append(
        "grant_type",
        "authorization_code"
    );

    try {

        const response = await axios.post(
            "https://api-v2.upstox.com/login/authorization/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Upstox Token Exchange Error:",
            error.response?.data || error.message
        );

        throw new Error("Failed to exchange Upstox authorization code");
    }
};