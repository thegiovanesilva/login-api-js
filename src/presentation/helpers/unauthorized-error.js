module.exports = class UnauthorizedError extends Error{
    constructor(paramName){
      super(`Unauthorized, invalid ${paramName}.`)
      this.name = 'UnauthorizedError'
    }
  }
  