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
    await this.loadUserByEmailRepository.load(email)
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
    const UseCase = sut.auth()
    await expect(UseCase).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const UseCase = sut.auth('any_email@mail.com')
    await expect(UseCase).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    await loadUserByEmailRepositorySpy.load('any_email@mail.com')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should call LoadUserByEmailRepository with correct password', async () => {
    const { loadUserByEmailRepositorySpy } = makeSut()
    await loadUserByEmailRepositorySpy.load('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.password).toBe('any_password')
  })
})
