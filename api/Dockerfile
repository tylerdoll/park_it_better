FROM python:3.9.0a5-alpine3.10

RUN mkdir /app
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN apk add --no-cache --update gcc chromium chromium-chromedriver && \
    pip3 install --no-cache-dir -r requirements.txt

# Copy builds
COPY src .

CMD ["python", "app.py"]
