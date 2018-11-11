## Getting Started (Node.js + Hapi framework)

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project (Node.js with Hapi framework)

Use NPM (version 7.6 or higher) to initialize your project and create package.json to store project dependencies.

```
npm init
```

Install crypto-js with --save flag to save dependency to our package.json file

```
npm install crypto-js --save
```

Install level with --save flag

```
npm install level --save
```

Install hapi (REST Framework) with --save flag

```
npm install hapi --save
```

## Start the server

To test code:

- Open a command prompt or shell terminal after install node.js.
- Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).

```
npm start
```
 or

```
node server.js
```

## Server API


###Endpoint GET:

```
http://localhost:8000/block/{height}
```

Get the block by height. Example of data received


{"hash":"a3a484dc601d22c96130e24424f058024398e96487a6d77704538a7892a0debe","height":3,"body":"Testing block with test string data","time":"1538482872","previousBlockHash":"97fee6b5f494e6a4064b49348318a329d030f762f0a234d27c164ecf988ebfba"}

###Endpoint POST: 

```
http://localhost:8000/block
```

Create a new block. Example of data to send

```
{
	"body": "Testing block with test string data"
}
```

Example of data received

{"hash":"a3a484dc601d22c96130e24424f058024398e96487a6d77704538a7892a0debe","height":3,"body":"Testing block with test string data","time":"1538482872","previousBlockHash":"97fee6b5f494e6a4064b49348318a329d030f762f0a234d27c164ecf988ebfba"}

