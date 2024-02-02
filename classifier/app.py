from fastapi import FastAPI, UploadFile, File
from io import BytesIO
from PIL import Image
from model import Model  # Import your Model class from your code file

app = FastAPI()

model = Model()  # Initialize your model

@app.post("/infer")
async def infer(image_file: UploadFile = File(...)):
    # Read image file
    image_data = await image_file.read()
    image = Image.open(BytesIO(image_data))

    # Call model for inference
    result = model(image)
    return {"result": result}


"Health check endpoint"
@app.get("/health")
async def health():
    return {"status": "ok"}

