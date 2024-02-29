FROM python:3.11


WORKDIR /code


COPY ./app/backend/requirements.txt /code/requirements.txt



RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt



COPY ./app/backend /code/backend



CMD ["uvicorn", "backend.simple_streaming:app", "--host", "0.0.0.0", "--port", "80"]
