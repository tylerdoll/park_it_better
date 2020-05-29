FROM python:3.8.3-alpine3.10

RUN mkdir /api
WORKDIR /api

# Install dependencies
COPY requirements.txt .
RUN apk add --no-cache --update musl-dev gcc chromium chromium-chromedriver && \
    pip3 install --no-cache-dir -r requirements.txt

COPY setup.py .
COPY api ./api
RUN pip install -e .

CMD ["python", "api/app.py"]
