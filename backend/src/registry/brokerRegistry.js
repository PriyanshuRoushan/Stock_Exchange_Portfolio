// Upstox Imports

import { fetchUpstoxHolding } from "../brokers/Upstox/holding.service.js";
import { normalizeUpstoxHoldings } from "../brokers/Upstox/normalizer.js";



// Zerodha Imports

// Broker Registry
export const brokerRegistry = {
    Upstox: {
        fetchHoldings: fetchUpstoxHolding,
        normalizeHoldings: normalizeUpstoxHoldings
    }

    // zerodha: {

    // }
}