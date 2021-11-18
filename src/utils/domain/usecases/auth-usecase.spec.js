const { InvalidParamError, MissingParamError } = require('../../errors/index')

class AuthUseCase {
  constructor (loadUserByEmailRepository){
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }
  async auth(email, password){
    if (!email){
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email, password) {
      this.email = email
      this.password = password
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return { 
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const authUseCase = sut.auth()
    await expect(authUseCase).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const UseCase = sut.auth('any_email@mail.com')
    await expect(UseCase).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const authUseCase = sut.auth('any_email@mail.com', 'any_password')
    await expect(authUseCase).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })
 
  test('Should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const authUseCase = sut.auth('any_email@mail.com', 'any_password')
    await expect(authUseCase).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
  test('Should return null if loadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})
