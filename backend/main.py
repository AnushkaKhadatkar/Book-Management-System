from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
import uuid
from datetime import datetime, timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# DATABASE DEPENDENCY
# -----------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------
# AUTH
# -----------------------

@app.post("/login")
def login(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or db_user.password_hash != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session_id = str(uuid.uuid4())

    new_session = models.Session(
        id=session_id,
        user_id=db_user.id,
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )

    db.add(new_session)
    db.commit()

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True
    )

    return {"message": "Login successful"}


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}


def get_current_user(request: Request, db: Session = Depends(get_db)):

    session_id = request.cookies.get("session_id")

    if not session_id:
        raise HTTPException(status_code=401, detail="Login required")

    session = db.query(models.Session).filter(models.Session.id == session_id).first()

    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired")

    return session.user_id


# -----------------------
# BOOK CRUD (PROTECTED)
# -----------------------

@app.post("/books/", response_model=schemas.BookResponse)
def create_book(book: schemas.BookCreate,
                db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user)):

    new_book = models.Book(
        title=book.title,
        author=book.author
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book


@app.get("/books/", response_model=list[schemas.BookResponse])
def get_books(db: Session = Depends(get_db),
              user_id: int = Depends(get_current_user)):

    return db.query(models.Book).all()


@app.get("/books/{book_id}", response_model=schemas.BookResponse)
def get_book(book_id: int,
             db: Session = Depends(get_db),
             user_id: int = Depends(get_current_user)):

    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return book


@app.put("/books/{book_id}", response_model=schemas.BookResponse)
def update_book(book_id: int,
                updated_book: schemas.BookCreate,
                db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user)):

    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    book.title = updated_book.title
    book.author = updated_book.author

    db.commit()
    db.refresh(book)

    return book


@app.delete("/books/{book_id}")
def delete_book(book_id: int,
                db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user)):

    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(book)
    db.commit()

    return {"message": "Book deleted successfully"}