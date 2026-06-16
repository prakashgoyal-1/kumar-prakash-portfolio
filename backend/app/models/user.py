import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = sa.Column(sa.String(255), unique=True, index=True, nullable=False)
    hashed_password = sa.Column(sa.String(255), nullable=True)  # nullable for OAuth users
    full_name = sa.Column(sa.String(255), nullable=True)
    role = sa.Column(sa.String(50), nullable=False, default="user")  # "admin" | "user"
    google_id = sa.Column(sa.String(255), unique=True, nullable=True)
    created_at = sa.Column(
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        nullable=False,
    )