from imageai.Classification import ImageClassification
import os

def getPrediction (path):
    execution_path = os.getcwd()
    prediction = ImageClassification()
    prediction.setModelTypeAsResNet50()
    prediction.setModelPath( execution_path + "/resnet50-19c8e357.pth")
    prediction.loadModel()
    result={}
    tagResults=[]
    predictions, percentage_probabilities = prediction.classifyImage(path, result_count=5)
    for index in range(len(predictions)):
        print(predictions[index] , " : " , percentage_probabilities[index])
        result[predictions[index]]=percentage_probabilities[index]
        tagResults.append({"tag":predictions[index],"probability":percentage_probabilities[index]})
    return result,tagResults