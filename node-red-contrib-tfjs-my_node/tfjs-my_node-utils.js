const tfjs = require('@tensorflow/tfjs-node');
const labels = require('./labels.js');



// Load model from local computer directory
const loadModel = async function (modelUrl) {

  console.log(`  My_node classification model is loaded from: ${modelUrl}`);
  model = await tfjs.loadGraphModel(modelUrl);

  return model;
}


// Takes an image as input, transofrms it into a Tensor with an added dimension
// and then normalizes it and saves the values as float
const processInput = function (imageBuffer) {
  console.log(`**** Begin input preprocess`);

  // Resize the image in 224x224 image
  let manipulated = tfjs.node.decodeImage(imageBuffer, 3)
                              .resizeNearestNeighbor([224, 224])
                              .toFloat()
                              .expandDims(0);

  // Normalize image over max value 255 and save as float
  integerTensor = manipulated.div(tfjs.scalar(255))
  integerTensor = tfjs.cast(integerTensor, dtype = 'float32');

  console.log(`**** Finish input preprocess`);
return integerTensor; 
}



// Takes the prediction obtained from the model, extract the values and
// finds the class with highest prediction, then displays the prediction in
// the debug tab
const processOutput = function(prediction){
     
  prediction_arr = prediction.dataSync();

  // Compute which is the highest score
  let max_val = 0;
  let detection = 0;
  if(prediction_arr[0] > prediction_arr[1]){
    detection = 1;
    max_val = prediction_arr[0];
  }else{
    detection = 2;
    max_val = prediction_arr[1];
  }

  // If percentage is not close to 80 propapbly there is no person
  pred_text = 'I\'m not sure this image contains a person';

  if(max_val > 0.8){
    if(detection == 1){
      pred_text = 'The person IS wearing a mask';
    }else if(detection == 2){
      pred_text = 'The person IS NOT wearing a mask'; 
    }
  }

  shape_tns  = prediction_arr.shape;

  console.log('***** Creating JSON output');
  const objects = [];

  objects.push({
    with_mask: Math.round(prediction_arr[0]*1000)/1000,
    without_mask: Math.round(prediction_arr[1]*1000)/1000,
    prediction: pred_text,
    shape_tns : shape_tns
  });

 return objects;
}





module.exports = {
  loadModel: loadModel,
  processInput: processInput,
  processOutput : processOutput
}