from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace password if different
DATABASE_URL = "mysql+pymysql://root:simmi1202%40@127.0.0.1:3306/book_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()