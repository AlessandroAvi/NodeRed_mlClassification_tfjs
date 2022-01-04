const tfjs = require('@tensorflow/tfjs-node');
const labels = require('./labels.js');

// load model from local computer directory
const loadModel = async function (modelUrl, fromTFHub) {

  console.log(`loading model from ${modelUrl}`); // Write on terminal

  const handler = 'file://node_modules/node-red-contrib-tfjs-my_node/my_model/model.json';

  model = await tfjs.loadGraphModel(handler);
  
  return model;
}





// Takes an image as input, transofrms it into a Tensor with an added dimension
// and then normalizes it and saves the values as float
const processInput = function (imageBuffer) {
  console.log(`*** Begin input preprocess`);

  manipulated = tfjs.node.decodeImage(imageBuffer, 3).expandDims(0);

  integerTensor = manipulated.div(tfjs.scalar(255))
  integerTensor = tfjs.cast(integerTensor, dtype = 'float32');

  console.log(`*** Finish input preprocess`);
return integerTensor; 
}


const processOutput = function(prediction){

  // oprendere la prediction e il msg.payload
  // salvare le percentuali delle due prediction in due container di numeri
  // ritornare un messaggio che dica mask: tot %; no mask: tot %
  // ritornare un altro messaggio che dice: the image contains / doens't contain a mask

}





module.exports = {
  loadModel: loadModel,
  processInput: processInput
}