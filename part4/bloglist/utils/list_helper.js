const _ = require('lodash')
const { listWithMultipleBlogs } = require('../tests/fake_blog_lists')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((record, blog) => {
    if (record === null || blog.likes > record.likes) {
      const { author, title, likes } = blog
      return { author, title, likes }
    } else {
      return record
    }
  }, null)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCountsByAuthor = _.countBy(blogs, 'author')
  const maxCount = Math.max(...Object.values(blogCountsByAuthor))

  const authorWithMostBlogs = Object.keys(blogCountsByAuthor).find(
    (author) => blogCountsByAuthor[author] === maxCount
  )

  return { author: authorWithMostBlogs, blogs: maxCount }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsByAuthor = _.groupBy(blogs, 'author')

  const likesByAuthor = _.mapValues(blogsByAuthor, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })

  const authors = [...Object.keys(likesByAuthor)]

  authors.sort((a, b) => {
    return likesByAuthor[a] - likesByAuthor[b]
  })

  const authorWithMostLikes = authors.at(-1)

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes],
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
