import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class About(Base):
    __tablename__ = "about"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    bio = sa.Column(sa.Text, nullable=True)
    photo_url = sa.Column(sa.String(500), nullable=True)
    title = sa.Column(sa.String(255), nullable=True)
    location = sa.Column(sa.String(255), nullable=True)