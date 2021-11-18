const { InvalidParamError, MissingParamError } = require('../../errors/index')

class AuthUseCase {
  async auth(email, password){
    if (!email){
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const UseCase = sut.auth()
    await expect(UseCase).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const UseCase = sut.auth('any_email@mail.com')
    await expect(UseCase).rejects.toThrow(new MissingParamError('password'))
  })
})
