from fastapi import FastAPI, UploadFile
from quickdraw_inference import load_model, predict_png_bytes

app = FastAPI()

# Load model once
model = load_model()

@app.post("/predict")
async def predict(file: UploadFile):
    png_bytes = await file.read()
    pred = predict_png_bytes(png_bytes, model)
    return {"prediction": pred}
