const { MongoClient } = require('mongodb')
let client, db

class LoadUserByEmailRepository {
  constructor(userModel){
    this.userModel = userModel
  }
  async load(email){
    const user = await this.userModel.findOne({ 
      email
     }, { 
       projection: { 
         password: 1 
        } 
      })
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmailRepository', () => {
  
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    var fakeUser = await userModel.insertOne({ 
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const key = fakeUser._id
    fakeUser = await userModel.findOne(key)
    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password  
    })
    
  })


})