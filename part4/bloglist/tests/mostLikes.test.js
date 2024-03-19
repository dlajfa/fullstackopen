const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostLikes } = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./fake_blog_lists')

describe('most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(mostLikes([]), null)
  })

  test('when list has only one blog, returns the correct author and likes', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    assert.deepStrictEqual(mostLikes(listWithOneBlog), expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    mostLikes(listWithMultipleBlogs)
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    assert.deepStrictEqual(mostLikes(listWithMultipleBlogs), expectedResult)
  })
})
