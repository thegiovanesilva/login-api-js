const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor(userModel){
    this.userModel = userModel
  }
  async update(userId, accessToken){
    await this.userModel.updateOne({ 
      _id: userId
     }, {
       $set: {
         accessToken
       }
     })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { 
    userModel, 
    sut
  }
}

describe ('UpdateAccessTokenRepository', () => {

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

  test('Should update user with the given accessToken' ,async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({ 
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    await sut.update(fakeUser.insertedId, 'valid_token')
    const updatedUser = await userModel.findOne({_id: fakeUser.insertedId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throws if no userModel is provided', async () => {
    const { userModel } = makeSut()
    const sut  = new UpdateAccessTokenRepository()
    let fakeUser = await userModel.insertOne({ 
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const promise = sut.update(fakeUser.insertedId, 'valid_token')
    expect(promise).rejects.toThrow()
  })
})