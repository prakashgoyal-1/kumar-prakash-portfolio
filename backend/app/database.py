from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# Async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,          # set True to log SQL for debugging
    pool_pre_ping=True,  # drop stale connections automatically
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Shared declarative base for all SQLAlchemy models."""
    pass


async def get_db():
    """FastAPI dependency — yields an AsyncSession per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise