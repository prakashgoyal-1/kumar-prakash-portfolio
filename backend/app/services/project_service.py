import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectOut,
    ProjectUpdate,
)


async def list_projects(
    db: AsyncSession,
    tech_filter: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> ProjectListResponse:
    base_query = select(Project)
    count_query = select(func.count()).select_from(Project)

    if tech_filter:
        # tech_stack is stored as JSON; cast to text and do a LIKE match.
        # Works on both PostgreSQL and SQLite (used in tests).
        like_pattern = f"%{tech_filter}%"
        base_query = base_query.where(
            sa_cast_tech_stack(Project.tech_stack).like(like_pattern)
        )
        count_query = count_query.where(
            sa_cast_tech_stack(Project.tech_stack).like(like_pattern)
        )

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    result = await db.execute(
        base_query.order_by(Project.created_at.desc()).limit(limit).offset(offset)
    )
    projects = list(result.scalars().all())

    return ProjectListResponse(
        items=[ProjectOut.model_validate(p) for p in projects],
        total=total,
        limit=limit,
        offset=offset,
    )


def sa_cast_tech_stack(column):
    """Cast the JSON tech_stack column to text for LIKE filtering.
    Works across PostgreSQL and SQLite dialects."""
    import sqlalchemy as sa
    return sa.cast(column, sa.String)


async def get_project(db: AsyncSession, project_id: uuid.UUID) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if project is None:
        raise NotFoundException("Project not found")
    return project


async def create_project(db: AsyncSession, data: ProjectCreate) -> Project:
    project = Project(id=uuid.uuid4(), **data.model_dump())
    db.add(project)
    await db.flush()
    return project


async def update_project(
    db: AsyncSession, project_id: uuid.UUID, data: ProjectUpdate
) -> Project:
    project = await get_project(db, project_id)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.flush()
    return project


async def delete_project(db: AsyncSession, project_id: uuid.UUID) -> None:
    project = await get_project(db, project_id)
    await db.delete(project)
    await db.flush()