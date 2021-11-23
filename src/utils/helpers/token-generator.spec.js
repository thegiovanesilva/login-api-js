

class TokenGenerator {
  async generate(){

  }
}
  
const makeSut = () => {
  return new TokenGenerator()
}



describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
  })
})