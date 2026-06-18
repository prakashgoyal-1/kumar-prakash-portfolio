import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = sa.Column(sa.String(255), nullable=False)
    description = sa.Column(sa.Text, nullable=True)
    # ⚠️ Use sa.JSON, NEVER ARRAY(String) — ARRAY is PostgreSQL-only
    # and breaks SQLite, which is used for tests.
    tech_stack = sa.Column(sa.JSON, nullable=False, default=list)
    image_url = sa.Column(sa.String(500), nullable=True)
    repo_url = sa.Column(sa.String(500), nullable=True)
    live_url = sa.Column(sa.String(500), nullable=True)
    featured = sa.Column(sa.Boolean, nullable=False, default=False)
    created_at = sa.Column(
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        nullable=False,
    )