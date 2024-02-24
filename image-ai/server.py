from sanic import Sanic
from sanic.response import text

import numpy as np
import tensorflow as tf
from model import model, IMG_SIZE
import os
from PIL import Image

model.load_weights('model.tf')
model.summary()


app = Sanic("MyHelloWorldApp")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")

@app.post("/predict")
async def predict(request):
    img_file = request.json['img_file']
    img = Image.open(img_file).resize(IMG_SIZE)
    img = np.array(img)
    [[y]] = model.predict(img[None,:,:])
    if y > 0: 
      return text('dog')
    else:
      return text('cat')


if __name__ == "__main__":
  app.run(dev=True)
