// Upstox Imports

import { fetchUpstoxHolding } from "../brokers/upstox/holding.service.js";
import { normalizeUpstoxHoldings } from "../brokers/upstox/normalizer.js";



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