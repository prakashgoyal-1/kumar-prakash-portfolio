import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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
    print("register_user called------------------------------: ")
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none() is not None:
        raise DuplicateException("A user with this email already exists")
    print("data------------------------------: ", data)
    user = User(
        id=uuid.uuid4(),
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role="user",
    )
    db.add(user)
    await db.flush()  # get the id without full commit (get_db commits on exit)
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