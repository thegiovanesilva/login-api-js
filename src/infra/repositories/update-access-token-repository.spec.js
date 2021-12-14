const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe ('UpdateAccessTokenRepository', () => {

  let fakeUserId

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })
  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({ 
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
    const updatedUser = await userModel.findOne({_id: fakeUserId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throws if no email is provided', async () => {
    const sut  = makeSut()
    const promise = sut.update(fakeUserId)
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})