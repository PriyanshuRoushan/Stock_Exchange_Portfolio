// Upstox Imports

import { fetchUpstoxHoldings } from "../brokers/upstox/holding.service.js";
import { normalizeUpstoxHoldings } from "../brokers/upstox/normalizer.js";



// Zerodha Imports

// Broker Registry
export const brokerRegistry = {
    Upstox: {
        fetchHoldings: fetchUpstoxHoldings,
        normalizeHoldings: normalizeUpstoxHoldings
    }

    // zerodha: {

    // }
}