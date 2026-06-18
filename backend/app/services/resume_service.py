import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume import Resume
from app.schemas.resume import ResumeOut
from app.services import storage_service

MAX_UPLOAD_MB = 10
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024


async def upload_resume(db: AsyncSession, file: UploadFile) -> ResumeOut:
    # ── Validate content type ───────────────────────────────────────────────
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files accepted")

    # ── Validate file size ───────────────────────────────────────────────────
    file_bytes = await file.read()
    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413, detail=f"File too large. Max {MAX_UPLOAD_MB}MB"
        )

    # ── Generate unique S3 key ───────────────────────────────────────────────
    key = f"resumes/{uuid.uuid4()}.pdf"

    # ── Upload to S3/MinIO ───────────────────────────────────────────────────
    storage_service.upload_file(file_bytes, key, "application/pdf")

    # ── Determine next version number ───────────────────────────────────────
    result = await db.execute(select(func.max(Resume.version)))
    max_version = result.scalar_one_or_none() or 0

    # ── Unset is_current on all existing resumes ────────────────────────────
    existing_result = await db.execute(select(Resume).where(Resume.is_current == True))  # noqa: E712
    for existing in existing_result.scalars().all():
        existing.is_current = False

    # ── Create the new current resume row ───────────────────────────────────
    resume = Resume(
        id=uuid.uuid4(),
        file_key=key,
        version=max_version + 1,
        is_current=True,
    )
    db.add(resume)
    await db.flush()

    download_url = storage_service.generate_presigned_url(key)
    out = ResumeOut.model_validate(resume)
    out.download_url = download_url
    return out


async def get_current_resume(db: AsyncSession) -> ResumeOut | None:
    result = await db.execute(select(Resume).where(Resume.is_current == True))  # noqa: E712
    resume = result.scalar_one_or_none()
    if resume is None:
        return None

    download_url = storage_service.generate_presigned_url(resume.file_key)
    out = ResumeOut.model_validate(resume)
    out.download_url = download_url
    return out


async def list_resume_history(db: AsyncSession) -> list[ResumeOut]:
    result = await db.execute(select(Resume).order_by(Resume.version.desc()))
    resumes = list(result.scalars().all())

    outputs = []
    for resume in resumes:
        download_url = storage_service.generate_presigned_url(resume.file_key)
        out = ResumeOut.model_validate(resume)
        out.download_url = download_url
        outputs.append(out)

    return outputs