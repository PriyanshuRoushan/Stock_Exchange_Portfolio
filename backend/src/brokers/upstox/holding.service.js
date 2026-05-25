import axios from "axios";

export const fetchUpstoxHolding = async (accessToken) => {
    try{
        const response = await axios.get(
          "https://api.upstox.com/v2/portfolio/long-term-holdings",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json"
                }
            }
        );

        return response.data;

    }catch(error){

        console.error(
            "Upstox Holdings Fetch Error:",
            error.response?.data || error.message
        );

        throw new Error("Failed to fetch Upstox holdings");
    }
}