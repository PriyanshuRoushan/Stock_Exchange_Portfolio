import { getUpstockLoginUrl, exchangeUpstockCode } from "../brokers/upstock/auth.service.js";

import { getZerodhaLoginUrl } from "../brokers/zerodha/auth.service.js";

// UPSTOCK CONNECTION
export const connectUpstock = async (req, res) => {
    try{
        const Url = getUpstockLoginUrl();
        res.reditect(Url);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// UPSTOCK CALLBACK
export const upstockCallback = async (req, res) => {
    try{
        const code = req.query.code;

        const response = await exchangeUpstockCode(code);

        res.status(200).json(response.data);
        
    }catch(error){
        res.status(5600).json({error: error.message});
    }
};
                                        // ZERODHA  
//ZEROD CONNECTION
export const connectZerodha = async (req, res) => {
    try{
        const Url = getZerodhaLoginUrl();
        res.reditect(Url);
    }catch(error){ 
        res.status(500).json({error: error.message});
    }
};

