from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# -----------------------
# BOOK SCHEMAS
# -----------------------

class BookBase(BaseModel):
    title: str
    author: str


class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------
# USER SCHEMAS
# -----------------------

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# -----------------------
# SESSION SCHEMA
# -----------------------

class SessionResponse(BaseModel):
    id: str
    user_id: int
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True