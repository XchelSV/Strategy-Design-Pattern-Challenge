import Authorizer from "./src/Authorizer.js"

const authorizer = new Authorizer();
authorizer.authorize(process.argv[2]);