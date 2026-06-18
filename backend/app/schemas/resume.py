import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    version: int
    uploaded_at: datetime
    download_url: str = ""  # populated from presigned URL at response time, not stored in DB