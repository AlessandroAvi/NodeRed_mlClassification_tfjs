const tfjs = require('@tensorflow/tfjs-node');



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
const processOutput = function(prediction, config){
     
  prediction_arr = prediction.dataSync();

  num_classes = parseInt(config.num_classes);

  labels = [];

  // very ugly code, couldn't manage to make it change shape dinamically
  if(num_classes == 1){
    labels = [config.class1];
  }else if(num_classes == 2){
    labels = [config.class1, config.class2];
  }else if(num_classes == 3){
    labels = [config.class1, config.class2, config.class3];
  }else if(num_classes == 4){
    labels = [config.class1, config.class2, config.class3, config.class4 ];
  }


  // Compute which is the highest score
  let max_val = 0;
  let detection = 0;

  for(let i=0; i<num_classes; i++){
    if(prediction_arr[i] > max_val){
      detection = i;
      max_val = prediction_arr[i];
    }
  }

  note_msg = "WARN: prediction is lower than 70 %";

  if(num_classes == 0){
    note_msg = "WARN: you have to specify a number of classes";
  }

  console.log('***** Creating JSON output');
  const objects = [];



  if(max_val < 0.7){
    objects.push({
      number_of_classes : num_classes,
      available_classes : labels,
      class_predicted : labels[detection],
      score : Math.round(max_val*100)/100,
      note : note_msg
    });
  }else{
    objects.push({
      number_of_classes : num_classes,
      available_labels : labels,
      label_predicted : labels[detection],
      score : Math.round(max_val*100)/100
    });
  }


 return objects;
}





module.exports = {
  loadModel: loadModel,
  processInput: processInput,
  processOutput : processOutput
}