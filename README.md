# Cocoa4All: Cocoa Visualization Platform

A full-stack data visualization application that aggregates cocoa price and producer price index (PPI) data, providing interactive dashboards with authentication.

## Project Overview

Cocoa4All consists of:
- **ETL Pipeline**: Loads CSV data (cocoa prices and PPI) into PostgreSQL with yearly aggregation and metric calculations
- **PostgreSQL Database**: Persistent data storage with precomputed yearly metrics
- **FastAPI Backend**: RESTful API with JWT authentication for user management and data retrieval
- **React Frontend**: Modern dashboard with authentication, interactive charts, and data tables

All services are containerized and orchestrated with Docker Compose for seamless deployment and testing.

## Prerequisites

- **Docker**: v24.0 or later
- **Docker Compose**: v2.20 or later

## Project Structure

```
cocoa4all/
├── docker-compose.yaml          # Service orchestration
├── .env                         # Shared environment configuration
├── .env.example                 # Example environment template
├── README.md                    # This file
├── datasources/
│   ├── cocoa_global_price.csv   # Monthly cocoa prices (PCOCOUSDM)
│   └── producer_price_index.csv # Monthly PPI data (PCU3113513113517)
├── etl/
│   ├── main.py                  # ETL pipeline script
│   ├── pyproject.toml           # Python dependencies
│   └── Dockerfile               # ETL container definition
├── backend/
│   ├── app/
│   │   ├── core/                # Configuration and security
│   │   ├── db/                  # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── services/            # Business logic
│   │   ├── api/routes/          # Route handlers
│   │   └── main.py              # FastAPI application
│   ├── pyproject.toml           # Python dependencies
│   ├── Dockerfile               # Backend container definition
│   └── README.md                # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── api/                 # API client
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── App.js               # Main app component
│   ├── package.json             # Node dependencies
│   ├── Dockerfile               # Frontend container definition
│   └── README.md                # Frontend documentation
```
All python projects use UV PYTHON PACKAGE AND PROJECT MANAGER

## Quick Start with Docker Compose

### 1. Configuration

The application uses a single root `.env` file for all services. A sample configuration is provided:

```bash
# Copy the example environment file (if needed)
cp .env.example .env
```

The application reads all configuration from the root `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | cocoa_user | Database username |
| `POSTGRES_PASSWORD` | cocoa_password | Database password |
| `POSTGRES_DB` | cocoa_db | Database name |
| `POSTGRES_PORT` | 5432 | Database port |
| `DATABASE_URL` | postgresql://... | Full database connection string |
| `REACT_APP_API_URL` | http://localhost:8000 | Backend API URL (frontend) |
| `SECRET_KEY` | your-super-secret-key... | JWT signing key |


### 2. Start the Application

```bash
docker compose up --build
```

This command will:
1. Build all container images (first run only, reuses cache on subsequent runs)
2. Start PostgreSQL with a health check
3. Run the ETL pipeline to load and aggregate data
4. Start the FastAPI backend (waits for database and ETL to complete)
5. Start the React frontend (waits for backend to start)


### 3. Access the Application

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main dashboard UI |
| **Backend API Docs** | http://localhost:8000/docs | Interactive API documentation (Swagger) |
| **PostgreSQL** | localhost:5432 | Database (host connection only) |

### 4. Test the Application

#### Register a New User

1. Navigate to http://localhost:3000
2. Click **"Register"** tab
3. Enter credentials:
   - Username: `amcho`
   - Email: `amcho@amcho.com`
   - Password: `amcho1234`
4. Click **"Register"**

#### Login

1. Click **"Login"** tab
2. Enter credentials:
   - Username: `amcho`
   - Password: `amcho1234`
3. Click **"Login"**

#### View Dashboard

After login, you will see:
- **Yearly Data Table**: Years as columns, metrics as rows with color-coded values (green = positive, red = negative)
- **Cocoa Price Chart**: Line chart showing yearly cocoa price trends
- **PPI Chart**: Line chart showing yearly producer price index trends
- **Mixed Indicators Chart**: Combined bar and line chart comparing cocoa prices and PPI



## Stopping the Application

```bash
# Stop all services
docker compose down

# Stop and remove all volumes (clears database)
docker compose down -v

# View logs of a specific service
docker compose logs backend
docker compose logs frontend
docker compose logs etl
docker compose logs postgres
```

## Running Individual Services Locally (Advanced)

If you prefer to run services locally without Docker:

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### ETL

```bash
cd etl
uv sync
uv run python main.py
```

**Note**: When running locally, PostgreSQL must be running separately (e.g., via Docker):
```bash
docker run -d --name cocoa_postgres \
  -e POSTGRES_USER=your_user \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=your_db \
  -p 5432:5432 \
  postgres:15-alpine
```

## Data Pipeline

### ETL Process

1. **Extract**: Reads CSV files from `datasources/`:
   - `cocoa_global_price.csv`: Monthly cocoa prices
   - `producer_price_index.csv`: Monthly PPI data

2. **Transform**: Aggregates monthly data into yearly summaries with calculated metrics:
   - `cocoa_price`: Yearly average cocoa price
   - `cocoa_price_change`: Absolute change from previous year
   - `cocoa_price_pct_change`: Percentage change from previous year
   - `ppi`: Yearly average producer price index
   - `ppi_change`: Absolute change from previous year
   - `ppi_pct_change`: Percentage change from previous year
   - `ppi_pct_change_reference`: Percentage change vs. 2011 baseline (reference year = 100%)

3. **Load**: Writes data to PostgreSQL in three tables:
   - `cocoa_global_price`: Raw monthly cocoa prices (created by ETL)
   - `producer_price_index`: Raw monthly PPI (created by ETL)
   - `yearly_data`: Precomputed yearly metrics (used by API)


## Authentication

The application uses:
- **Password Hashing**: Argon2 (via passlib)
- **Token Authentication**: JWT with HS256 algorithm
- **Token Expiry**: 30 minutes

Credentials are managed by the backend and stored securely in PostgreSQL.


### Frontend can't connect to backend

```bash
# Verify REACT_APP_API_URL in .env
cat .env | grep REACT_APP_API_URL

# Check backend is running and healthy
curl http://localhost:8000/health

# Check browser console for CORS errors
```

### Port conflicts

To use different ports, edit `docker-compose.yaml`:

```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Change host port from 3000 to 3001
  backend:
    ports:
      - "8001:8000"  # Change host port from 8000 to 8001
```

Then update `.env`:
```env
REACT_APP_API_URL=http://localhost:8001
```

### Viewing Service Logs

```bash
# All services
docker compose logs -f

# Specific service (follow output)
docker compose logs -f backend

# Last 50 lines
docker compose logs --tail=50 etl
```

## License & Attribution

This project uses:
- **FastAPI**: Modern Python web framework
- **React**: JavaScript UI library
- **PostgreSQL**: Open-source database
- **Docker**: Containerization platform
- **Material-UI (MUI)**: React component library
- **Recharts**: React charting library

**Last Updated**: May 21, 2026  
**Version**: 1.0.0
