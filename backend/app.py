from flask import Flask,request,jsonify,abort
from pymongo import MongoClient
from flask_cors import CORS
import base64
import json
from bson import json_util
from PIL import Image
from io import BytesIO
import numpy as np
from recognition import getPrediction
app=Flask(__name__)
CORS(app)
client=MongoClient("mongodb://localhost:27017/")
db = client["image_recognition"]

# @app.route('/')
# def hello():
#     return jsonify({"a":2})

@app.route('/<id>')
def getId(id):
    return {"id":id}
@app.route('/images')
def getImages():
    args = request.args.get('search')
    print(args)
    images=''
    if args: 
        images=db.images.find({"tags":{'$regex':'{}'.format(args)}})
    else: 
        images=db.images.find()

    result=json_util.dumps({"data": images})
   
    return json.loads(result)

@app.route('/recognition',methods=[ 'POST'])
def getRecognition():
    try:
        imgdata = request.form.get('img').split(',')[1]
        print(imgdata)
        decoded = base64.b64decode(imgdata)
        img = np.array(Image.open(BytesIO(decoded)))
        prediction,tags=getPrediction(img)
        db.images.insert_one({"uid":request.form.get('uid'),"img":request.form.get('img'),"tags":tags,"result":prediction})
        return  prediction
    except Exception as error:
        abort(500,error) 

if __name__ == '__main__':
    app.run()

