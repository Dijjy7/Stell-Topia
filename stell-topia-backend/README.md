# Stell-Topia Backend

NestJS gateway for the Stell-Topia flight-booking protocol. Handles booking orchestration, fare aggregation proxy, auth, and Stellar/Soroban interactions.

## Setup

```bash
cd stell-topia-backend
npm install
cp .env.example .env
npm run start:dev
```

## Architecture

```
stell-topia-backend/
  src/
    auth/           # JWT auth guard + login endpoint
    booking/        # Booking orchestration controller/service
    fares/          # Proxy to Python fare aggregation API
    stellar/        # Stellar Horizon + Soroban contract interactions
    common/         # Shared decorators
    app.module.ts   # Root module
```

## Modules

| Module | Responsibility |
|--------|----------------|
| `auth` | JWT login, guard, current-user decorator |
| `booking` | Create booking, fetch booking details |
| `fares` | Proxy fare search to Python API |
| `stellar` | Prepare Soroban escrow transactions |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login with email/password |
| GET | `/api/v1/auth/me` | Get current user profile |
| GET | `/api/v1/fares/search` | Proxy flight search to Python API |
| POST | `/api/v1/bookings` | Create a new booking |
| GET | `/api/v1/bookings/:id` | Get booking details |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `PYTHON_API_URL` | `http://localhost:8000/api/v1` | Python fare API URL |
| `JWT_SECRET` | `changeme` | JWT signing secret |
| `STELEAR_HORIZON_URL` | `https://horizon.stellar.org` | Stellar Horizon endpoint |
| `SOROBAN_CONTRACT_ID` | `""` | Deployed Soroban contract ID |

## Running

```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```
