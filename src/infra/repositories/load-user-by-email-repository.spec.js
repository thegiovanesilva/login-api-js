const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
let db

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmailRepository', () => {

  beforeAll(async () => { 
    await MongoHelper.connect(process.env.MONGO_URL)
    db = MongoHelper.db
  })
  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const sut = makeSut()
    let fakeUser = await db.collection('users').insertOne({ 
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    fakeUser = await  db.collection('users').findOne(fakeUser.insertedId)
    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password  
    })
  })

  test('Should throws if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })


})