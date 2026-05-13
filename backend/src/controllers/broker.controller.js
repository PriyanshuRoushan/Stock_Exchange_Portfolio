import { getUpstockLoginUrl, exchangeUpstockCode } from "../brokers/upstock/auth.service.js";

import { getZerodhaLoginUrl, exchangeZerodhaCode } from "../brokers/zerodha/auth.service.js";


/*
UUU     UUU  PPPPPPPPP   SSSSSSS  TTTTTTTTT   OOOOOO0   CCCCCCC  KKK   KKK
UUU     UUU  PPP    PPP SS           TTT     OOO   OOO CCC       KKK KKK
UUU     UUU  PPPPPPPPP   SSSSS       TTT     OOO   OOO CCC       KKKKK
UUU     UUU  PPP              SS     TTT     OOO   OOO CCC       KKK KKK
 UUUUUUUUU   PPP        SSSSSSS      TTT      OOOOOOO   CCCCCCC  KKK   KKK
*/
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
        const Url = getZerodhaLoginUrl();
        res.reditect(Url);
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

export const conncetGrow = async (req, res) => {
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
