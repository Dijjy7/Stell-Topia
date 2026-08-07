import random
from datetime import datetime, timedelta
from typing import Any

from app.config import settings
from app.schemas import Flight, SearchRequest


class BaseProvider:
    name: str = "base"

    async def search(self, query: SearchRequest) -> list[Flight]:
        raise NotImplementedError


class MockProviderA(BaseProvider):
    name = "stellar_airways"

    async def search(self, query: SearchRequest) -> list[Flight]:
        base = datetime.strptime(query.departure_date, "%Y-%m-%d")
        flights = []
        for i in range(random.randint(1, 3)):
            dep = base + timedelta(hours=8 + i * 3, minutes=random.randint(0, 59))
            arr = dep + timedelta(hours=random.randint(5, 9), minutes=random.randint(10, 50))
            price_usd = random.choice([385, 420, 450, 520, 580])
            flights.append(
                Flight(
                    id=f"{self.name[:2].upper()}{random.randint(100, 999)}",
                    airline="Stellar Airways",
                    from_code=query.from_code,
                    to_code=query.to_code,
                    departure_time=dep.strftime("%Y-%m-%dT%H:%M:%S"),
                    arrival_time=arr.strftime("%Y-%m-%dT%H:%M:%S"),
                    duration_minutes=int((arr - dep).total_seconds() / 60),
                    stops=0,
                    price_usd=price_usd,
                    price_xlm=round(price_usd / settings.xlm_to_usd_rate, 2),
                    seats_available=random.randint(1, 20),
                )
            )
        return flights


class MockProviderB(BaseProvider):
    name = "skybridge"

    async def search(self, query: SearchRequest) -> list[Flight]:
        base = datetime.strptime(query.departure_date, "%Y-%m-%d")
        flights = []
        for i in range(random.randint(1, 2)):
            dep = base + timedelta(hours=10 + i * 4, minutes=random.randint(0, 59))
            arr = dep + timedelta(hours=random.randint(6, 10), minutes=random.randint(10, 50))
            price_usd = random.choice([410, 490, 560])
            flights.append(
                Flight(
                    id=f"{self.name[:2].upper()}{random.randint(100, 999)}",
                    airline="SkyBridge Connect",
                    from_code=query.from_code,
                    to_code=query.to_code,
                    departure_time=dep.strftime("%Y-%m-%dT%H:%M:%S"),
                    arrival_time=arr.strftime("%Y-%m-%dT%H:%M:%S"),
                    duration_minutes=int((arr - dep).total_seconds() / 60),
                    stops=1,
                    price_usd=price_usd,
                    price_xlm=round(price_usd / settings.xlm_to_usd_rate, 2),
                    seats_available=random.randint(1, 15),
                )
            )
        return flights


class FareAggregator:
    def __init__(self) -> None:
        self.providers: list[BaseProvider] = [
            MockProviderA(),
            MockProviderB(),
        ]

    async def search(self, query: SearchRequest) -> list[Flight]:
        results: list[tuple[Flight, str]] = []
        for provider in self.providers:
            flights = await provider.search(query)
            for flight in flights:
                results.append((flight, provider.name))

        flights = [f for f, _ in results]

        sort_key = {
            "price": lambda f: f.price_usd,
            "duration": lambda f: f.duration_minutes,
            "departure": lambda f: f.departure_time,
        }[query.sort_by.value]

        reverse = query.sort_order == SortOrder.desc
        flights.sort(key=sort_key, reverse=reverse)

        return flights


fare_aggregator = FareAggregator()
