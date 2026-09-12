import pool from "../config/db.js";
import { getUpstoxLoginUrl, exchangeUpstoxCode , fetchUpstoxProfile} from "../brokers/upstox/auth.service.js";
import { getZerodhaLoginUrl, exchangeZerodhaCode } from "../brokers/zerodha/auth.service.js";


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
        const url = getUpstoxLoginUrl(userId);
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
        const userId = parseInt(state, 10);

        if (isNaN(userId)) {
            throw new Error("Invalid or missing user ID state parameter");
        }

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

        res.status(200).json({tokenData, profileData});
        
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
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 
                h.id,
                h.symbol,
                COALESCE(h.exchange, 'NSE') AS exchange,
                h.quantity,
                COALESCE(h.average_buy_price, 0) AS avg_price,
                COALESCE(h.average_buy_price, 0) AS average_buy_price,
                COALESCE(h.current_price, 0) AS current_price,
                COALESCE(h.company_name, h.symbol) AS company_name,
                h.asset_type,
                h.pnl,
                h.pnl_percentage,
                h.updated_at
            FROM holdings h
            JOIN connected_accounts ca ON h.connected_account_id = ca.id
            WHERE ca.user_id = $1
            ORDER BY h.updated_at DESC`,
            [userId]
        );

        res.status(200).json({ holdings: result.rows });
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: error.message });
    }
};
