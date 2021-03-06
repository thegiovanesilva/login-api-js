const { MissingParamError } = require('../../utils/errors/index')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, encrypter, updateAccessTokenRepository, tokenGenerator } = {})
  {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.tokenGenerator = tokenGenerator
  }
  async auth(email, password){
    if (!email){
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAccessTokenRepository.update(user._id, accessToken)
      return accessToken
    }
    return null
  }
}