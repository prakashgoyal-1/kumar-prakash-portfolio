import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class Certification(Base):
    __tablename__ = "certifications"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = sa.Column(sa.String(255), nullable=False)
    issuer = sa.Column(sa.String(255), nullable=False)
    issue_date = sa.Column(sa.Date, nullable=False)
    credential_url = sa.Column(sa.String(500), nullable=True)