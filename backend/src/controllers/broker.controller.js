import pool from "../config/db.js";
import { getUpstoxLoginUrl, exchangeUpstoxCode , fetchUpstoxProfile} from "../brokers/upstox/auth.service.js";
import { getZerodhaLoginUrl, exchangeZerodhaCode } from "../brokers/zerodha/auth.service.js";
import { createBrokerState, readBrokerState } from "../utils/brokerState.js";
import { getPortfolioForUser } from "../services/portfolio.service.js";
import { syncPortfolio } from "../services/sync.service.js";
import {
    getUpstoxSnapshot,
    parseUpstoxResources,
} from "../services/upstox-data.service.js";


/*
UUU     UUU  PPPPPPPPP   SSSSSSS  TTTTTTTTT   OOOOOO0   CCCCCCC  KKK   KKK
UUU     UUU  PPP    PPP SS           TTT     OOO   OOO CCC       KKK KKK
UUU     UUU  PPPPPPPPP   SSSSS       TTT     OOO   OOO CCC       KKKKK
UUU     UUU  PPP              SS     TTT     OOO   OOO CCC       KKK KKK
 UUUUUUUUU   PPP        SSSSSSS      TTT      OOOOOOO   CCCCCCC  KKK   KKK
*/

// Upstox CONNECTION
export const connectUpstox = async (req, res) => {
    try{
        const userId = req.user.id;
        const state = createBrokerState({ userId, broker: "Upstox" });
        const url = getUpstoxLoginUrl(state);
        res.redirect(url);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// Upstox CALLBACK
export const upstoxCallback = async (req, res) => {
    try{
        const code = req.query.code;
        const state = req.query.state;
        const { userId } = readBrokerState(state, "Upstox");

        const tokenData = await exchangeUpstoxCode(code);
        const profileData = await fetchUpstoxProfile(tokenData.accessToken);

        // Resolve broker ID from database
        const brokerResult = await pool.query(
            "SELECT id FROM brokers WHERE name = $1",
            ["Upstox"]
        );

        if (brokerResult.rows.length === 0) {
            throw new Error("Broker Upstox not found in database. Please seed the brokers table.");
        }

        const brokerId = brokerResult.rows[0].id;

        await pool.query(
            `INSERT INTO connected_accounts (
                user_id,
                broker_id,
                broker_user_name,
                broker_user_id,
                access_token,
                refresh_token,
                token_expiry,
                connection_status,
                last_synced_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (user_id, broker_id)
            DO UPDATE SET
                broker_user_name = EXCLUDED.broker_user_name,
                broker_user_id = EXCLUDED.broker_user_id,
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                token_expiry = EXCLUDED.token_expiry,
                connection_status = EXCLUDED.connection_status,
                last_synced_at = NOW()`,
            [
                userId,
                brokerId,
                profileData.data.user_name || null,
                profileData.data.user_id,
                tokenData.accessToken,
                tokenData.refreshToken || null,
                new Date(Date.now() + (tokenData.expiresIn || 86400) * 1000),
                "connected"
            ]
        );

        res.status(200).json({
            success: true,
            message: "Upstox account connected. Call POST /api/brokers/upstox/sync to import holdings.",
            account: { broker: "Upstox", brokerUserId: profileData.data.user_id }
        });
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

/*
ZZZZZZZ  EEEEE  RRRRRR    OOOOO   DDDD    H   H   AAAAA
    ZZ   E      RR   RR  OO   OO  D   DD  H   H  AA   AA
   ZZ    EEEE   RRRRRR   OO   OO  D   DD  HHHHH  AAAAAAA
  ZZ     E      RR  RR   OO   OO  D   DD  H   H  AA   AA
ZZZZZZZ  EEEEE  RR   RR   OOOOO   DDDD    H   H  AA   AA
*/


//ZEROD CONNECTION
export const connectZerodha = async (req, res) => {
    try{
        const userId = req.user.id;
        const url = getZerodhaLoginUrl(userId);
        res.redirect(url);
    }catch(error){ 
        res.status(500).json({error: error.message});
    }
};

//ZEROD CALLBACK
export const zerodhaCallback = async (req, res) => {
    try{
        const code = req.query.code;

        const response = await exchangeZerodhaCode(code);

        res.status(200).json({message: "Zerodha Callback"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

/*
 GGGGG   RRRRRR    OOOOO   WWW   WWW   WWW
GG       RR   RR  OO   OO  WWW   WWW   WWW
GG GGGG  RRRRRR   OO   OO  WWW W WWW W WWW
GG   GG  RR  RR   OO   OO  WWWWWWWWWWWWWWW
 GGGGG   RR   RR   OOOOO    WWWWW   WWWWW
*/

export const connectGrow = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const growCallback = async (req, res) => {
    try{
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


/*
 AAAAA   N   N   GGGGG   EEEEE  L       OOOOO   N   N  EEEEE
AA   AA  NN  N  GG       E      L      OO   OO  NN  N  E
AAAAAAA  N N N  GG GGG   EEEE   L      OO   OO  N N N  EEEE
AA   AA  N  NN  GG   GG  E      L      OO   OO  N  NN  E
AA   AA  N   N   GGGGG   EEEEE  LLLLL   OOOOO   N   N  EEEEE
*/

export const conncetAngelone = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const angeloneCallback = async (req, res) => {
    try{
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const getHoldings = async (req, res) => {
    try {
        const portfolio = await getPortfolioForUser(req.user.id);
        res.status(200).json({ success: true, ...portfolio });
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAccounts = async (req, res) => {
    try {
        const portfolio = await getPortfolioForUser(req.user.id);
        res.status(200).json({ success: true, accounts: portfolio.accounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const syncBroker = async (req, res) => {
    const broker = req.params.broker?.toLowerCase() === "upstox" ? "Upstox" : null;
    if (!broker) return res.status(400).json({ error: "Unsupported broker" });

    try {
        const result = await syncPortfolio(req.user.id, broker);
        const portfolio = await getPortfolioForUser(req.user.id);
        res.status(200).json({ success: true, sync: result, portfolio });
    } catch (error) {
        const status = error.response?.status === 401 ? 401 : 500;
        res.status(status).json({ success: false, error: error.message });
    }
};

export const getUpstoxAccountData = async (req, res) => {
    try {
        const resources = parseUpstoxResources(req.query.include);
        const pageNumber = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const pageSize = Math.min(100, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 20));
        const snapshot = await getUpstoxSnapshot(req.user.id, {
            resources,
            pageNumber,
            pageSize,
        });

        res.status(200).json({ success: true, ...snapshot });
    } catch (error) {
        const status = error.status || (error.message.startsWith("Unsupported") ? 400 : 500);
        res.status(status).json({ success: false, error: error.message });
    }
};
