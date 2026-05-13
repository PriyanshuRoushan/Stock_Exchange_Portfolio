import axios from "axios";


// Login URL
export const getUpstockLoginUrl = ()=>{
    return `https://api-v2.upstox.com/login/authorization/dialog
   ?response_type=code
   &client_id=${process.env.UPSTOX_API_KEY}
   &redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;
};

// Oauth 2.0
export const exchangeUpstockCode = async(code) =>{
    const params = new URLSearchParams();

    params.appand("code", code);

    params.append(
        "client_id", 
        process.env.UPSTOX_API_KEY,
    );

    params.append(
        "client_secret",
        process.env.UPSTOX_API_SECRET,
    );

    params.append(
        "redirect_uri",
        process.env.UPSTOX_REDIRECT_URI,
    );

    params.append(
        "grant_type",
        "authorization_code",
    );

    const response = await axios.post(
        "https://api-v2.upstox.com/login/authorization/token",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data;
};