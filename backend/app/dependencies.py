import uuid

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import CredentialsException, ForbiddenException
from app.core.security import decode_token
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False,  # returns None instead of raising when token is absent
)


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Require a valid JWT. Raises 401 if missing or invalid."""
    if not token:
        raise CredentialsException()

    payload = decode_token(token)  # raises CredentialsException on bad token

    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise CredentialsException()

    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise CredentialsException()

    return user


async def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have the 'admin' role."""
    if current_user.role != "admin":
        raise ForbiddenException()
    return current_user


async def get_optional_user(
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Return the authenticated user, or None if no/invalid token.
    Use on public endpoints that surface extra data to admins."""
    if not token:
        return None

    try:
        payload = decode_token(token)
    except CredentialsException:
        return None

    user_id: str | None = payload.get("sub")
    if user_id is None:
        return None

    try:
        result = await db.execute(
            select(User).where(User.id == uuid.UUID(user_id))
        )
        return result.scalar_one_or_none()
    except Exception:
        return None