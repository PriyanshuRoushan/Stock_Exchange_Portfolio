import axios from "axios";

// Step 1: Generate Login URL
export const getUpstoxLoginUrl = (state) => {
    return `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;
};

// Step 2: Exchange Authorization Code for Access Token
export const exchangeUpstoxCode = async (code) => {

    if(!code)   {
        throw new Error("Missing authorization code");
    }

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
            "https://api.upstox.com/v2/login/authorization/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            }
        );

        return {
            accessToken: response.data.access_token,
            userId: response.data.user_id,
        };

    } catch (error) {

        console.error(
            "Upstox Token Exchange Error:",
            error.response?.data || error.message
        );

        throw new Error("Failed to exchange Upstox authorization code");
    }
};

// feth upstox profile
export const fetchUpstoxProfile = async (accessToken) => {
    try{
        const res = await axios.get("https://api.upstox.com/v2/user/profile", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });
        return res.data;

    }catch{
        console.error("Upstox Profile Fetch Error", error.response?.data || error.message);
        throw new Error("Failed to fetch Upstox profile");
    }
};