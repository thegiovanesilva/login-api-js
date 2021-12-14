module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/setup-project',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.port || 5858 
}  