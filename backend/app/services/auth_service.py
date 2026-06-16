import uuid

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.exceptions import CredentialsException, DuplicateException
from app.core.security import (
    build_token_response,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate


async def register_user(db: AsyncSession, data: UserCreate) -> TokenResponse:
    # Check for duplicate email
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none() is not None:
        raise DuplicateException("A user with this email already exists")

    user = User(
        id=uuid.uuid4(),
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role="user",
    )
    db.add(user)
    await db.flush()
    return build_token_response(str(user.id), user.role)


async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        return None
    if not user.hashed_password:
        return None  # OAuth-only account — no password set
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def refresh_access_token(
    db: AsyncSession, refresh_token: str
) -> TokenResponse:
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise CredentialsException()

    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise CredentialsException()

    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise CredentialsException()

    return build_token_response(str(user.id), user.role)


async def authenticate_google_user(
    db: AsyncSession, id_token: str
) -> TokenResponse:
    # Verify the Google ID token against our client ID
    try:
        idinfo = google_id_token.verify_oauth2_token(
            id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        # Token is invalid or expired
        raise CredentialsException() from exc

    google_id: str = idinfo["sub"]
    email: str = idinfo.get("email", "")
    full_name: str = idinfo.get("name", "")

    # 1. Try to find user by google_id first
    result = await db.execute(
        select(User).where(User.google_id == google_id)
    )
    user = result.scalar_one_or_none()

    if user is None:
        # 2. Try to find by email (account may exist from email/password signup)
        result = await db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if user is not None:
            # Link the existing account to Google
            user.google_id = google_id
            await db.flush()
        else:
            # 3. Create a brand-new user
            user = User(
                id=uuid.uuid4(),
                email=email,
                full_name=full_name,
                google_id=google_id,
                hashed_password=None,  # OAuth users have no password
                role="user",
            )
            db.add(user)
            await db.flush()

    return build_token_response(str(user.id), user.role)