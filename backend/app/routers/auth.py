from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import CredentialsException
from app.core.security import build_token_response
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import (
    RefreshRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserOut,
)
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


class GoogleTokenRequest(BaseModel):
    id_token: str


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await auth_service.register_user(db, data)


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate_user(db, data.email, data.password)
    if user is None:
        raise CredentialsException()
    return build_token_response(str(user.id), user.role)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.refresh_access_token(db, data.refresh_token)


@router.post("/google", response_model=TokenResponse)
async def google_login(
    data: GoogleTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    return await auth_service.authenticate_google_user(db, data.id_token)


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user