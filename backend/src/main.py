from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.auth.api.rest import router as auth_router
from src.mining.api.rest import router as mining_router
from src.core.auth.exceptions import UnauthorizedException
from src.core.config import settings
from src.core.logging_setup import setup_fastapi_logging


def setup_cors(app: FastAPI):
    if settings.ENVIRONMENT == "prod":
        origins = ["https://demo.0xstratix.com"]
    else:
        origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://192.168.0.13:8000",
            "http://172.18.0.4:3000",
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def setup_exceptions_handler(app: FastAPI):
    @app.exception_handler(UnauthorizedException)
    def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
        raise HTTPException(status_code=401, detail="Unauthorized")


def setup_app():
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url="/api/openapi.json",
        redoc_url="/api/redoc",
        docs_url="/api/docs"
    )

    setup_cors(app)
    setup_exceptions_handler(app)
    setup_fastapi_logging(app)

    app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
    app.include_router(mining_router, prefix="/api/mining", tags=["Mining"])

    return app


app = setup_app()