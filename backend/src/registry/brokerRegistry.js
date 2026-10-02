// Upstox Imports

import { fetchUpstoxHoldings } from "../brokers/upstox/holding.service.js";
import { normalizeUpstoxHoldings } from "../brokers/upstox/normalizer.js";
import { fetchAngelOneHoldings } from "../brokers/angelone/holding.service.js";
import { normalizeAngelOneHoldings } from "../brokers/angelone/normalizer.js";



// Zerodha Imports

// Broker Registry
export const brokerRegistry = {
    Upstox: {
        fetchHoldings: fetchUpstoxHoldings,
        normalizeHoldings: normalizeUpstoxHoldings
    },
    "Angel One": {
        fetchHoldings: fetchAngelOneHoldings,
        normalizeHoldings: normalizeAngelOneHoldings
    }

    // zerodha: {

    // }
}
