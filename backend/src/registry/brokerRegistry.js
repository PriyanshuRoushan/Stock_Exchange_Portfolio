// Upstock Imports

import { fetchUpstockHolding } from "../brokers/upstock/holding.service.js";
import { normalizeUpstoxHoldings } from "../brokers/upstock/normalizer.js";



// Zerodha Imports

// Broker Registry
export const brokerRegistry = {
    upstock: {
        fetchHoldings: fetchUpstockHolding,
        normalizeHoldings: normalizeUpstoxHoldings
    }

    // zerodha: {

    // }
}