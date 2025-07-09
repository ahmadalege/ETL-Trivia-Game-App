from fastapi import FastAPI, HTTPException, Query
from db import get_db_connection
import json
import random
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to the Data Quizzer API!"}

@app.get("/questions")
def get_questions(limit: int = 10, category: str = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()

    if category:
        # It's better to add ORDER BY RANDOM() here before LIMIT if you want random samples from a category
        # However, random.sample after fetchall is also fine for smaller datasets.
        cursor.execute("SELECT * FROM trivia_questions WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM trivia_questions")

    rows = cursor.fetchall() # These rows are dict-like due to conn.row_factory = sqlite3.Row
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No questions found")

    # Sample 'limit' questions randomly from the fetched rows
    sampled_rows = random.sample(rows, min(limit, len(rows)))

    questions_for_frontend = [] # Rename for clarity
    for row in sampled_rows: # Iterate over sampled_rows
        # Prepare all options for display, and shuffle them
        options = [
            row["correct_answer"],
            row["incorrect_1"],
            row["incorrect_2"],
            row["incorrect_3"]
        ]
        random.shuffle(options)

        questions_for_frontend.append({
            "id": row["id"],
            "question": row["question"],
            "category": row["category"],
            "difficulty": row["difficulty"],
            "options": options,
            "correct_answer": row["correct_answer"] # <--- ADD THIS LINE!
        })

    return questions_for_frontend # Return the list of question dictionaries


@app.get("/categories")
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT category FROM trivia_questions")
    categories = [row["category"] for row in cursor.fetchall()]
    conn.close()

    return {"categories": categories}


class AnswerCheck(BaseModel):
    question_id: int
    selected_answer: str

@app.post("/check")
def check_answer(payload: AnswerCheck):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT correct_answer FROM trivia_questions WHERE id = ?", (payload.question_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = (payload.selected_answer == row["correct_answer"])
    return {"correct": is_correct}