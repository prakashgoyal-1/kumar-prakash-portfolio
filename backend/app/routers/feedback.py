import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackListResponse,
    FeedbackOut,
    FeedbackStatusUpdate,
)
from app.services import feedback_service

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackOut, status_code=201)
async def submit_feedback(
    name: str,
    email: str,
    message: str,
    rating: int,
    attachment: Optional[UploadFile] = File(default=None),
    db: AsyncSession = Depends(get_db),
):
    # Note: rate limiting applied in Commit 22 (slowapi)
    data = FeedbackCreate(name=name, email=email, message=message, rating=rating)
    return await feedback_service.create_feedback(db, data, attachment)


@router.get("", response_model=FeedbackListResponse)
async def list_approved_feedback(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await feedback_service.list_approved_feedback(db, limit=limit, offset=offset)


@router.get("/all", response_model=FeedbackListResponse)
async def list_all_feedback(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await feedback_service.list_all_feedback(db, limit=limit, offset=offset)


@router.patch("/{feedback_id}/status", response_model=FeedbackOut)
async def update_status(
    feedback_id: uuid.UUID,
    data: FeedbackStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await feedback_service.update_feedback_status(db, feedback_id, data)