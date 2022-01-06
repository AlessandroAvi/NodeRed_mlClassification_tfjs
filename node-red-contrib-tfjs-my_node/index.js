// CUSTOM NODE BEHAVIOUR
// this is the main file where the behaviour of my_node is defined



// export the node module
module.exports = function(RED) {

    //Import my library
    const tfutil = require('./tfjs-my_node-utils.js');
 

    // Function definition for loading the model
    async function loadModel (config, node) {
        node.model = await tfutil.loadModel(config.modelUrl); 
    }



    // Function definition:  define the node's behavior
    function TfjsTutorialNode(config) {
        // initialize the features
        RED.nodes.createNode(this, config);
        const node = this
    
        loadModel(config, node);
        
        
        // register a listener to get called whenever a message arrives at the node
        node.on('input', function (msg) {
          console.log(`** Input received`); // Write on terminal
          
          // preprocess the incoming image into a tensor
          const inputTensor = tfutil.processInput(msg.payload);   

          console.log(`*** Beginning prediction`); // Write on terminal
    
          // perform the predictionS
          const result = node.model
            .executeAsync(inputTensor)    // executes prediction, inputTensor is the image
            .then(prediction => {
              msg.payload = tfutil.processOutput(prediction);    // transforms the precition in readable json format              
            
              node.send(msg.payload);
            });

          console.log(`***** Finished prediction *****`); // Write on terminal
        });
    }

    // register the node with the runtime
    RED.nodes.registerType('tfjs-my_node-node', TfjsTutorialNode);
}
