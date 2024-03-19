const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlogs } = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./fake_blog_lists')

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(mostBlogs([]), null)
  })

  test("when list has only one blog, returns the correct author and count", () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    }
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const expectedResult = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    assert.deepStrictEqual(mostBlogs(listWithMultipleBlogs), expectedResult)
  })
})
