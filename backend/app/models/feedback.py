import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = sa.Column(sa.String(255), nullable=False)
    email = sa.Column(sa.String(255), nullable=False)
    message = sa.Column(sa.Text, nullable=False)
    rating = sa.Column(sa.Integer, nullable=False)
    # S3 object key only — NOT a full URL (presigned URL generated at response time)
    attachment_key = sa.Column(sa.String(500), nullable=True)
    # pending / approved / rejected
    status = sa.Column(sa.String(50), nullable=False, default="pending")
    created_at = sa.Column(
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        nullable=False,
    )

    __table_args__ = (
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="feedback_rating_range"),
    )