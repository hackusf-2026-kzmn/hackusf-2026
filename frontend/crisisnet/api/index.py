from .main import app as _fastapi_app


class _StripApiPrefix:
    """Strip /api prefix so FastAPI routes like /scout still match."""
    def __init__(self, asgi_app):
        self.app = asgi_app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path.startswith("/api"):
                scope = dict(scope)
                scope["path"] = path[len("/api"):] or "/"
        await self.app(scope, receive, send)


app = _StripApiPrefix(_fastapi_app)
