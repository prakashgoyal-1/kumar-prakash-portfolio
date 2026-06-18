import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    file_key = sa.Column(sa.String(500), nullable=False)  # S3 object key, not full URL
    version = sa.Column(sa.Integer, nullable=False)
    uploaded_at = sa.Column(
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        nullable=False,
    )
    is_current = sa.Column(sa.Boolean, nullable=False, default=False)