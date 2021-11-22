const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  } 
}

describe('Encrypter', () => {
  test('Ensure return true if bycript returns true', async () => {
  const sut = new Encrypter()
  const isValid = await sut.compare('any_value', 'hashed_value')
  expect(isValid).toBe(true)
  })

  test('Ensure return false if bycript returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
    })
})