FROM python:3.11


WORKDIR /code


COPY requirements.txt /code/requirements.txt



RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt




# Now copy the entire backend directory content into /code
COPY . /code



# Command to run the application
CMD ["uvicorn", "student_agent_streaming:app", "--host", "0.0.0.0", "--port", "80"]
