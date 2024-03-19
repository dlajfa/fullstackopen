const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favoriteBlog } = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./fake_blog_lists')

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })

  test("when list has only one blog, return the blog's info", () => {
    const expectedResult = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const expectedResult = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    assert.deepStrictEqual(favoriteBlog(listWithMultipleBlogs), expectedResult)
  })
})
