
import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, column_property, mapped_column, Mapped

class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"   
    __table_args__ = (
        UniqueConstraint("name", "admin", name="users_constraint_1"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    admin: Mapped[int]
    xp: Mapped[int]


class UserBadges(Base):
    __tablename__ = "user_badges"    
    __table_args__ = (
        UniqueConstraint("userid", "badgeid", name="user_badge_constraint_1"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    userid = mapped_column(Integer, ForeignKey("users.id"))
    badgeid = mapped_column(Integer, ForeignKey("badges.id"))
    timestamp: Mapped[datetime.datetime]


class Badges(Base):
    __tablename__ = "badges"   
    __table_args__ = (
        UniqueConstraint("name", "description", name="badge_constraint_1"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]