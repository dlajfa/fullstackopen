const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const user = { username: 'test', password: 'test' }

  await api.post('/api/users').send(user)

  const result = await api.post('/api/login').send(user)

  token = result.body.token

  for (const blog of helper.initialBlogs()) {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  }
})

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all the blogs', async () => {
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs().length)
  })

  test('key "id" is in the first blog', async () => {
    const blogs = await helper.blogsInDb()
    const firstBlog = blogs[0]
    assert('id' in firstBlog)
  })
})

describe.only('post requests', () => {
  test.only('can add a valid blog', async () => {
    const newBlog = {
      title: 'test blog title',
      author: 'anonymous',
      url: 'https://google.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs().length + 1)

    const titles = blogs.map((blog) => blog.title)
    assert(titles.includes('test blog title'))
  })

  test.only('likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'blog without likes',
      author: 'anonymous',
      url: 'https://google.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const blogs = await helper.blogsInDb()
    const savedBlog = blogs.find((blog) => blog.title === 'blog without likes')

    assert.strictEqual(savedBlog.likes, 0)
  })

  test.only('blog without title is a bad request(400)', async () => {
    const newBlog = {
      author: 'anonymous',
      url: '',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test.only('blog without url is rejected (400)', async () => {
    const newBlog = {
      title: 'blog without url',
      author: 'anonymous',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test.only('post without valid token is rejected (401)', async () => {
    const newBlog = {
      title: 'test blog title',
      author: 'anonymous',
      url: 'https://google.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('delete requests', () => {
  test('deleting exsisting blog works', async () => {
    const originalBlogs = await helper.blogsInDb()
    const blog = originalBlogs[0]

    await api.delete(`/api/blogs/${blog.id}`)
    const updatedBlogs = await helper.blogsInDb()

    assert.strictEqual(updatedBlogs.length, originalBlogs.length - 1)
    assert.strictEqual(updatedBlogs.includes(blog), false)
  })
})

describe('put requests', () => {
  test('updating existing blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const response = await api
      .put(`/api/blogs/${blog.id}`)
      .send({ ...blog, likes: blog.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blog.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
