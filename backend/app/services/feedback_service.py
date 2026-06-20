import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.feedback import Feedback
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackListResponse,
    FeedbackOut,
    FeedbackStatusUpdate,
)
from app.services import storage_service

MAX_ATTACHMENT_MB = 5
MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024

ALLOWED_ATTACHMENT_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp"}


def _build_feedback_out(feedback: Feedback) -> FeedbackOut:
    """Build FeedbackOut, generating a presigned URL for the attachment
    if one exists. Always called when returning feedback to clients."""
    out = FeedbackOut.model_validate(feedback)
    if feedback.attachment_key:
        try:
            out.attachment_url = storage_service.generate_presigned_url(
                feedback.attachment_key,
                expires_in=3600,
            )
        except Exception:
            # Fail gracefully — attachment URL not critical
            out.attachment_url = None
    return out


async def create_feedback(
    db: AsyncSession,
    data: FeedbackCreate,
    attachment: UploadFile | None = None,
) -> FeedbackOut:
    attachment_key: str | None = None

    # ── Process attachment if provided ──────────────────────────────────────
    if attachment and attachment.filename:
        file_bytes = await attachment.read()

        if len(file_bytes) > MAX_ATTACHMENT_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Attachment too large. Max {MAX_ATTACHMENT_MB}MB",
            )

        ext = os.path.splitext(attachment.filename)[1].lower()
        if ext not in ALLOWED_ATTACHMENT_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_ATTACHMENT_EXTENSIONS)}",
            )

        attachment_key = f"feedback-attachments/{uuid.uuid4()}{ext}"
        storage_service.upload_file(
            file_bytes,
            attachment_key,
            attachment.content_type or "application/octet-stream",
        )

    # ── Create feedback row ─────────────────────────────────────────────────
    feedback = Feedback(
        id=uuid.uuid4(),
        name=data.name,
        email=data.email,
        message=data.message,
        rating=data.rating,
        attachment_key=attachment_key,
        status="pending",
    )
    db.add(feedback)
    await db.flush()

    return _build_feedback_out(feedback)


async def list_approved_feedback(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
) -> FeedbackListResponse:
    count_result = await db.execute(
        select(func.count()).select_from(Feedback).where(
            Feedback.status == "approved"
        )
    )
    total = count_result.scalar_one()

    result = await db.execute(
        select(Feedback)
        .where(Feedback.status == "approved")
        .order_by(Feedback.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    items = [_build_feedback_out(f) for f in result.scalars().all()]

    return FeedbackListResponse(items=items, total=total, limit=limit, offset=offset)


async def list_all_feedback(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
) -> FeedbackListResponse:
    count_result = await db.execute(
        select(func.count()).select_from(Feedback)
    )
    total = count_result.scalar_one()

    result = await db.execute(
        select(Feedback)
        .order_by(Feedback.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    items = [_build_feedback_out(f) for f in result.scalars().all()]

    return FeedbackListResponse(items=items, total=total, limit=limit, offset=offset)


async def update_feedback_status(
    db: AsyncSession,
    feedback_id: uuid.UUID,
    data: FeedbackStatusUpdate,
) -> FeedbackOut:
    result = await db.execute(
        select(Feedback).where(Feedback.id == feedback_id)
    )
    feedback = result.scalar_one_or_none()
    if feedback is None:
        raise NotFoundException("Feedback not found")

    feedback.status = data.status
    await db.flush()

    return _build_feedback_out(feedback)