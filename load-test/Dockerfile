FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8089

# Command to run on container start
CMD ["locust", "--host=http://localhost:4000"]