// CUSTOM NODE BEHAVIOUR
// this is the main file where the behaviour of my_node is defined

// export the node module
module.exports = function(RED) {

    // define the node's behavior
    function TfjsTutorialNode(config) {
        // initialize the features
        RED.nodes.createNode(this, config);

        // register a listener to get called whenever a message arrives at the node
        this.on('input', function(msg) {
            msg.payload = 'tutto ok il nodo funziona';
            node.send(msg);
        // handle incoming message
        });
    }

    // register the node with the runtime
    RED.nodes.registerType('tfjs-my_node-node', TfjsTutorialNode);
}
