from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from src.auth.api.dependencies import AuthUoWDepend, PasswordHelperDepend, AuthProviderDepend
from src.auth.application.use_cases.login import LoginUseCase
from src.auth.application.use_cases.register import RegisterUseCase
from src.auth.domain.dtos import RegisterDTO, LoginDTO, RegisterResponseDTO
from src.auth.domain.entities import AuthToken

router = APIRouter()


@router.post("/register", status_code=201, response_model=RegisterResponseDTO)
async def register_account(
        dto: RegisterDTO,
        auth_uow: AuthUoWDepend,
        password_helper: PasswordHelperDepend,
        auth_provider: AuthProviderDepend
):
    return await RegisterUseCase(auth_uow, password_helper, auth_provider).execute(dto)


@router.post("/login", response_model=AuthToken)
async def login_account(auth_uow: AuthUoWDepend, password_helper: PasswordHelperDepend,
                        auth_provider: AuthProviderDepend, form: OAuth2PasswordRequestForm = Depends()):
    dto = LoginDTO(name=form.username, password=form.password)
    return await LoginUseCase(auth_uow, auth_provider, password_helper).execute(dto)
