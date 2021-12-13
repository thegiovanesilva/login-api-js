const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let db

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe ('UpdateAccessTokenRepository', () => {

  let fakeUserId

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = MongoHelper.db
  })
  beforeEach(async () => {
    await db.collection('users').deleteMany()
    const fakeUser = await db.collection('users').insertOne({ 
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    fakeUserId = fakeUser.insertedId
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update user with the given accessToken' ,async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const updatedUser = await db.collection('users').findOne({_id: fakeUserId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throws if no email is provided', async () => {
    const sut  = makeSut()
    const promise = sut.update(fakeUserId)
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})