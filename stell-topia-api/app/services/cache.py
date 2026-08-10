import time
from typing import Any

from app.config import settings


class InMemoryCache:
    def __init__(self) -> None:
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Any | None:
        item = self._store.get(key)
        if not item:
            return None
        value, expires_at = item
        if time.time() > expires_at:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: Any) -> None:
        self._store[key] = (value, time.time() + settings.cache_ttl_seconds)

    def invalidate(self, key: str) -> None:
        self._store.pop(key, None)


cache = InMemoryCache()
