FROM python:3.11-slim

WORKDIR /app

# Copy requirements.txt and install dependencies first for caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Add the current working directory to PYTHONPATH
ENV PYTHONPATH=/app:$PYTHONPATH

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]