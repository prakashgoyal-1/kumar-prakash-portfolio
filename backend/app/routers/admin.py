from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_admin
from app.models.certification import Certification
from app.models.feedback import Feedback
from app.models.project import Project
from app.models.resume import Resume
from app.models.skill import Skill
from app.models.user import User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    # ── Total projects ────────────────────────────────────────────────────
    total_projects_result = await db.execute(
        select(func.count()).select_from(Project)
    )
    total_projects: int = total_projects_result.scalar_one()

    # ── Total feedback (all statuses) ─────────────────────────────────────
    total_feedback_result = await db.execute(
        select(func.count()).select_from(Feedback)
    )
    total_feedback: int = total_feedback_result.scalar_one()

    # ── Pending feedback count ─────────────────────────────────────────────
    pending_result = await db.execute(
        select(func.count())
        .select_from(Feedback)
        .where(Feedback.status == "pending")
    )
    pending_feedback_count: int = pending_result.scalar_one()

    # ── Average rating (approved feedback only, 1 decimal) ────────────────
    avg_result = await db.execute(
        select(func.avg(Feedback.rating))
        .where(Feedback.status == "approved")
    )
    avg_raw = avg_result.scalar_one_or_none()
    average_rating: float | None = (
        round(float(avg_raw), 1) if avg_raw is not None else None
    )

    # ── Current resume version ─────────────────────────────────────────────
    resume_result = await db.execute(
        select(Resume.version).where(Resume.is_current.is_(True)).limit(1)
    )
    resume_current_version: int | None = resume_result.scalar_one_or_none()

    # ── Total skills ───────────────────────────────────────────────────────
    total_skills_result = await db.execute(
        select(func.count()).select_from(Skill)
    )
    total_skills: int = total_skills_result.scalar_one()

    # ── Total certifications ───────────────────────────────────────────────
    total_certifications_result = await db.execute(
        select(func.count()).select_from(Certification)
    )
    total_certifications: int = total_certifications_result.scalar_one()

    return {
        "total_projects": total_projects,
        "total_feedback": total_feedback,
        "pending_feedback_count": pending_feedback_count,
        "average_rating": average_rating,
        "resume_current_version": resume_current_version,
        "total_skills": total_skills,
        "total_certifications": total_certifications,
    }