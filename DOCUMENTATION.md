# Portfolio Aggregator Backend

## Current data flow

1. A user signs in and receives an HTTP-only JWT cookie.
2. The user starts Upstox OAuth through `GET /api/brokers/upstox/connect`.
3. The OAuth callback stores the Upstox account and its access token.
4. The frontend calls `POST /api/brokers/upstox/sync` while authenticated.
5. The backend fetches, normalizes, and persists the connected user's holdings.
6. The portfolio APIs return only that user's stored accounts and active holdings.

## Portfolio APIs

All APIs below require the authenticated session cookie or Bearer token.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/brokers/accounts` | Connected brokers, sync state, holdings count, and account value |
| `GET` | `/api/brokers/holdings` | Consolidated holdings, account list, and portfolio summary |
| `POST` | `/api/brokers/upstox/sync` | Fetch and persist Upstox long-term holdings |
| `GET` | `/api/brokers/upstox/account-data` | Fetch current Upstox account data on demand (not persisted) |
| `GET` | `/api/dashboard/overview` | Portfolio summary plus the best and worst real holdings |

## Upstox account data

`GET /api/brokers/upstox/account-data` fetches only the authenticated user's
connected Upstox account. It returns each available result independently, so a
temporary issue with one Upstox API does not hide the other data.

By default it fetches open positions, today's order book, funds and margin,
mutual-fund holdings, and news for the user's holdings. Add
`?include=positions,orders,funds,mutualFunds,news,profile` to choose exactly
what is needed. News pagination accepts `page` and `pageSize` (up to 100).

The response contains `data` for successful calls and `errors` keyed by a
resource that Upstox could not provide. The access token is never included.
Orders, funds, news, positions, and mutual funds are read live and are not
saved yet; long-term equity holdings continue to be persisted through the sync
endpoint.

## Canonical holding fields

Every broker adapter returns a common holding: symbol, company name, exchange,
ISIN, instrument token, quantity, average buy price, current price, current and
invested value, total and daily P&L, daily change percentage, asset type, and
currency. Broker-specific responses are not sent directly to the frontend.

## Security notes

- OAuth state is a signed, short-lived JWT tied to the user and broker.
- Access tokens remain server-side; authentication responses no longer return a JWT in JSON.
- The production deployment should encrypt broker tokens at rest and use a secrets manager.
