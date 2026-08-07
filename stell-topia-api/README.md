# Stell-Topia Fare API

FastAPI service that aggregates external fare and inventory sources into a single searchable feed for the Stell-Topia flight-booking protocol.

## Setup

```bash
cd stell-topia-api
pip install -r requirements.txt
uvicorn main:app --reload
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Liveness / readiness check |
| POST | `/api/v1/flights/search` | Search available flights |

## Search Request

```json
{
  "from": "JFK",
  "to": "LHR",
  "departure_date": "2025-01-15",
  "return_date": "2025-01-22",
  "passengers": 1,
  "sort_by": "price",
  "sort_order": "asc"
}
```

## Search Response

```json
{
  "data": [
    {
      "id": "SA742",
      "airline": "Stellar Airways",
      "from_code": "JFK",
      "to_code": "LHR",
      "departure_time": "2025-01-15T10:00:00",
      "arrival_time": "2025-01-15T22:15:00",
      "duration_minutes": 435,
      "stops": 0,
      "price_usd": 450.0,
      "price_xlm": 4090.91,
      "seats_available": 12
    }
  ],
  "meta": {
    "count": 1,
    "currency": "USD",
    "xlmRate": 0.11,
    "providers": ["mock_a", "mock_b", "mock_c"]
  }
}
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `XLM_TO_USD_RATE` | `0.11` | Conversion rate for XLM pricing |
| `EXTERNAL_PROVIDERS` | `mock_a,mock_b,mock_c` | Comma-separated provider names |

## Running Tests

```bash
pytest
```
