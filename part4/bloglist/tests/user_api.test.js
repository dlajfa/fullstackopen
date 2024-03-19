const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('creating users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('valid user can be added', async () => {
    const usersBeforeTest = await helper.usersInDb()

    const user = {
      username: 'whoami',
      name: 'godknows',
      password: 'canuguess',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterAction = await helper.usersInDb()
    assert.strictEqual(usersAfterAction.length, usersBeforeTest.length + 1)

    const usernamesAfterAction = usersAfterAction.map((user) => user.username)
    assert(usernamesAfterAction.includes('whoami'))
  })

  test('username less than 3 characters is rejected', async () => {
    const usersBeforeTest = await helper.usersInDb()

    const user = {
      username: 'x',
      name: 'godknows',
      password: 'canuguess',
    }

    const result = await api.post('/api/users').send(user).expect(400)
    assert(
      result.body.error.includes('shorter than the minimum allowed length')
    )

    const usersAfterAction = await helper.usersInDb()
    assert.strictEqual(usersAfterAction.length, usersBeforeTest.length)

    const usernamesAfterAction = usersAfterAction.map((user) => user.username)
    assert(!usernamesAfterAction.includes('x'))
  })

  test('duplicate username is rejected', async () => {
    const user = {
      username: 'whoami',
      name: 'godknows',
      password: 'canuguess',
    }

    await api.post('/api/users').send(user)

    const usersBeforeAction = await helper.usersInDb()

    const anotherUser = {
      username: 'whoami',
      name: 'wonttellu',
      password: 'nomatterwhat',
    }

    const result = await api.post('/api/users').send(anotherUser).expect(400)

    assert(result.body.error.includes('username must be unique'))

    const usersAfterAction = await helper.usersInDb()
    assert.strictEqual(usersAfterAction.length, usersBeforeAction.length)

    const namesAfterAction = usersAfterAction.map((user) => user.name)
    assert(!namesAfterAction.includes('wonttellu'))
  })

  test('password less than 3 characters is rejected', async () => {
    const usersBeforeTest = await helper.usersInDb()

    const user = {
      username: 'whoami',
      name: 'godknows',
    }

    const result = await api.post('/api/users').send(user).expect(400)
    assert(
      result.body.error.includes('password missing or less than 3 characters')
    )

    const usersAfterAction = await helper.usersInDb()
    assert.strictEqual(usersAfterAction.length, usersBeforeTest.length)

    const usernamesAfterAction = usersAfterAction.map((user) => user.username)
    assert(!usernamesAfterAction.includes('whoami'))
  })
})
