from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.schemas.resume import ResumeOut
from app.services import resume_service

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.get("")
async def get_resume(db: AsyncSession = Depends(get_db)):
    resume = await resume_service.get_current_resume(db)
    if resume is None:
        return {"message": "No resume uploaded yet"}
    return resume


@router.post("", response_model=ResumeOut, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await resume_service.upload_resume(db, file)


@router.get("/history", response_model=list[ResumeOut])
async def resume_history(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await resume_service.list_resume_history(db)