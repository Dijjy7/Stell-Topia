from fastapi import FastAPI

from app.config import settings
from app.routers import flights

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(flights.router, prefix=settings.api_prefix)
