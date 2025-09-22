from fastapi import FastAPI, Request, HTTPException


from src.auth.api.rest import router as auth_router
from src.core.auth.exceptions import UnauthorizedException
from src.core.config import settings
from src.core.logging_setup import setup_fastapi_logging

def setup_exceptions_handler(app: FastAPI):
    @app.exception_handler(UnauthorizedException)
    def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
        raise HTTPException(status_code=401, detail="Unauthorized")


def setup_app():
    app = FastAPI(title=settings.PROJECT_NAME, openapi_url="/backend/openapi.json", redoc_url="/backend/redoc",
                  docs_url="/backend/docs")
    setup_exceptions_handler(app)
    setup_fastapi_logging(app)
    app.include_router(auth_router, prefix="/backend/auth", tags=["Auth"])

    return app


app = setup_app()
