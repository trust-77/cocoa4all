from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CocoacGlobalPrice(Base):
    __tablename__ = "cocoa_global_price"

    id = Column(Integer, primary_key=True, index=True)


class ProducerPriceIndex(Base):
    __tablename__ = "producer_price_index"

    id = Column(Integer, primary_key=True, index=True)
