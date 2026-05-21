# Cocoa Backend API

FastAPI backend for Cocoa4All data visualization application.

## Features

- Authentication with encrypted passwords
- User management
- Data visualization endpoints
- PostgreSQL integration

## Structure

- `app/core`: configuration and security helpers
- `app/db`: SQLAlchemy base and session setup
- `app/models`: database models
- `app/schemas`: Pydantic request/response models
- `app/services`: business logic
- `app/api/routes`: FastAPI route handlers
- `app/main.py`: FastAPI application entrypoint

## Setup

```bash
uv sync
```

## Running

```bash
uvicorn app.main:app --reload
```

The application runs from `app.main:app`.
