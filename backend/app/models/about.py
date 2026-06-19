import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class About(Base):
    __tablename__ = "about"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    bio = sa.Column(sa.Text, nullable=True)
    # photo_key stores the S3 object key — presigned URL generated at response time
    # photo_url kept for backward compat (external URL fallback if no photo_key)
    photo_key = sa.Column(sa.String(500), nullable=True)
    photo_url = sa.Column(sa.String(500), nullable=True)
    title = sa.Column(sa.String(255), nullable=True)
    location = sa.Column(sa.String(255), nullable=True)