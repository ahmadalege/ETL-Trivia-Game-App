import requests
import sqlite3
import html
import time

DB_PATH =  '/data/trivia.db'
MAX_RETRIES = 5
RETRY_DELAY = 2  # seconds

def wait_for_db():
    for attempt in range(MAX_RETRIES):
        try:
            conn = sqlite3.connect(DB_PATH)
            return conn
        except sqlite3.OperationalError:
            print(f"🔁 DB not ready (attempt {attempt + 1}/{MAX_RETRIES}), retrying in {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)
    raise Exception("🚫 Database not ready after multiple attempts")

def extract_trivia_data(amount=10):
    url = f"https://opentdb.com/api.php?amount={amount}&type=multiple"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to fetch trivia data")
    return response.json()["results"]

def transform_data(raw_questions):
    transformed = []
    for item in raw_questions:
        question = html.unescape(item["question"])
        correct = html.unescape(item["correct_answer"])
        incorrect = [html.unescape(ans) for ans in item["incorrect_answers"]]
        transformed.append({
            "question": question,
            "correct_answer": correct,
            "incorrect_1": incorrect[0],
            "incorrect_2": incorrect[1],
            "incorrect_3": incorrect[2],
            "category": item["category"],
            "difficulty": item["difficulty"]
        })
    return transformed

def load_to_db(data):
    conn = wait_for_db()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trivia_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT UNIQUE,
            correct_answer TEXT,
            incorrect_1 TEXT,
            incorrect_2 TEXT,
            incorrect_3 TEXT,
            category TEXT,
            difficulty TEXT
        )
    ''')

    for q in data:
        try:
            cursor.execute('''
                INSERT INTO trivia_questions (
                    question, correct_answer,
                    incorrect_1, incorrect_2, incorrect_3,
                    category, difficulty
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                q["question"], q["correct_answer"],
                q["incorrect_1"], q["incorrect_2"], q["incorrect_3"],
                q["category"], q["difficulty"]
            ))
        except sqlite3.IntegrityError:
            print(f"⚠️ Skipping duplicate: {q['question']}")

    conn.commit()
    conn.close()

def main():
    raw = extract_trivia_data(amount=110) 
    clean = transform_data(raw)
    load_to_db(clean)
    print("✅ ETL complete. Loaded trivia questions.")

if __name__ == "__main__":
    main()
