const SHA256 = require('crypto-js/sha256');
const DB = require('./simpleDB');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
class Block{
  constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}



/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  
  constructor(){

   //If height  == -1 add Genesis Block 
   this.getBlockHeight().then((height) => {
      if (height == -1 ) {
        this.addBlock(new Block("Genesis block")).then(() => console.log("Added Genesis block"))
      }
    })

  }

  /* ===== addBlock ==============================
  | Add block to blockchain
  | param: newBlock
  | return: none
  |  ===============================================*/
  async addBlock(newBlock) {
    
   //Get height from DB 
   const height = await this.getBlockHeight()
   newBlock.height = height + 1
   //UTC time
   newBlock.time = new Date().getTime().toString().slice(0, -3)
   
   //If the first non Genesis block has been added, link to previous block. 
   if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
   }

   //Create hash
   newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()

   //Add block to DB
   console.log("Add block: "+newBlock.height)
   await DB.addBlockToDB(newBlock.height, JSON.stringify(newBlock))
   return newBlock
  }

  /* ===== getBlockHeight ==============================
  | Get number of blocks in the chain frmo DB 
  | param: none
  | return: height
  |  ===============================================*/
  async getBlockHeight() {
    return DB.getBlockHeightFromDB()
  }

  /* ===== getBlock ==============================
  | Get block from DB blockchain
  | param: blockHeight (number of the block)
  | return: Block (Object)
  |  ===============================================*/
  async getBlock(blockHeight) {
    return JSON.parse(await DB.getBlockFromDB(blockHeight))
  }


  /* ===== validateBlock ==============================
  | Validate the block
  | param: blockHeight (number of the block)
  | return: boolean
  |  ===============================================*/
  async validateBlock(blockHeight) {
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
    block.hash = '';
    
    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log("Invalid hash: "+blockHeight);
      return false;
     }
  }
   

  /* ===== validateBlock ==============================
  | Validate the block
  | param: blockHeight (number of the block)
  | return: boolean
  |  ===============================================*/
   async validateChain() {

    let errorLog = []
    let previousHash = ''
 
    const height = await this.getBlockHeight()

    for (let i = 0; i <= height; i++) {

      this.getBlock(i).then((block) => {

        console.log("Check block:" + i)  

        this.validateBlock(block.height).then( (valid) => {

          if (!valid) {
            console.log("Invalid block")
            errorLog.push(block.height)
          } 

          if (i>0) {
            this.getBlock(i-1).then((previousBlock) => {
              if (block.previousBlockHash !== previousBlock.hash) {
                console.log("Invalid chain")
                errorLog.push(block.height)
              }
              if (i == height){
                 this.printErrors(errorLog)
              }
            })
          }
        })
        

      })

    }

  }


  printErrors(errorLog) {
    if (errorLog.length > 0) {
      console.log("Blocks errors: "+ errorLog)
    } else {
      console.log('No errors detected')
    }
  }

}

/*
let blockchain = new Blockchain();

(function theLoop(i) {
  setTimeout(() => {
    blockchain.addBlock(new Block(`Test block ${i}`)).then(() => {
      if (--i) {
        theLoop(i)
      }
    })
  }, 100);
})(10);

blockchain.getBlockHeight().then((h) => {console.log(h)})



setTimeout(() => blockchain.validateChain(), 1000)
*/

module.exports = {
  Blockchain,
  Block
};
