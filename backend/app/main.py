from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.data import router as data_router
from app.api.routes.system import router as system_router
from app.db.session import init_db


app = FastAPI(
    title="Cocoa Visualization API",
    description="Backend API for Cocoa data visualization",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


app.include_router(system_router)
app.include_router(auth_router)
app.include_router(data_router)
