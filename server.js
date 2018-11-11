'use strict';
const {Blockchain, Block} = require('./simpleChain')

const Hapi=require('hapi');

let blockchain = new Blockchain()

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {
        let methods = []
        server.table().forEach((route) => { methods.push(route.method+":"+route.path)})
        return methods;
    }
});

server.route({
    method:'GET',
    path:'/block/{height}',
    handler: async function(request,reply) {
        let height = request.params.height
        let heightDB = await  blockchain.getBlockHeight()

        if ((isNaN(height)) || (height == null) || (height =="")) {
           
            return "Block number/height must be a number"

        } else {
           
            if ((height>heightDB) || (height<0)){
                return "Unknown block number/height"
            } else {
                return await blockchain.getBlock(height)
            }
        }
        
    }
});

server.route({
    method:'POST',
    path:'/block',
    handler: async function(request,reply) {

        let block= request.payload;
        try {
            //let block = JSON.parse(payload);
            if ((block.body == null) || (block.body=="")) {
                return "No body data"
            } else {

                let addedBlock = await blockchain.addBlock(new Block(block.body))
                return addedBlock
            }

        } catch (e) {
            return "No body data"
        }
       
        
    }
});



// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();