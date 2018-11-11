const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== addBlockToDB ==============================
| Add block to database
| param: key, value
| return: Promise
|  ===============================================*/
function addBlockToDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject("Block submission failed")
        }
        resolve('Block submission successful')
      })
    })
}

/* ===== getBlockFromDB ==============================
| Add block to database
| param: key
| return: Promise
|  ===============================================*/
function getBlockFromDB(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (error) {
          reject(error)
        }
        resolve(value)
      })
    })
  }

/* ===== getBlockHeightFromDB ==============================
| Add block to database, the Genesis Block is not counted
| param: none
| return: Promise
|  ===============================================*/
function getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
      let height = -1
      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        reject(error)
      }).on('close', () => {
        resolve(height)
      })
    })
 }

 module.exports = {
  addBlockToDB,
  getBlockFromDB,
  getBlockHeightFromDB
};