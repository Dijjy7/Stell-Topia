from fastapi import APIRouter, Depends, HTTPException

from app.config import settings
from app.schemas import SearchRequest, SearchResponse
from app.security import get_current_user
from app.services.providers import fare_aggregator

router = APIRouter()


@router.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name, "version": settings.app_version}


@router.post("/flights/search", response_model=SearchResponse, tags=["flights"])
async def search_flights(query: SearchRequest, _: str = Depends(get_current_user)) -> SearchResponse:
    try:
        flights = await fare_aggregator.search(query)
        return SearchResponse(
            data=flights,
            meta={
                "count": len(flights),
                "currency": "USD",
                "xlmRate": settings.xlm_to_usd_rate,
                "providers": settings.external_providers,
            },
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail="Fare aggregation failed") from exc
