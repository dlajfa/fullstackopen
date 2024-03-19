const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!('title' in body)) {
    return response.status(400).json({ error: 'missing title' })
  }

  if (!('url' in body)) {
    return response.status(400).json({ error: 'missing url' })
  }

  const { title, author, url, likes = 0 } = body

  const blog = new Blog({ title, author, url, likes, user: user._id })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// blogsRouter.put('/:id', async (request, response, next) => {
//   const body = request.body

//   if (!('title' in body)) {
//     return response.status(400).json({ error: 'missing title' })
//   }

//   if (!('url' in body)) {
//     return response.status(400).json({ error: 'missing url' })
//   }

//   const { title, author, url, likes = 0 } = body
//   const newBlogInfo = { title, author, url, likes }

//   try {
//     const blog = await Blog.findById(request.params.id)
//     Object.assign(blog, newBlogInfo)
//     await blog.save()
//     response.json(blog)
//   } catch (error) {
//     next(error)
//   }
// })

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (user._id.toString() !== blog.user.toString()) {
      return response
        .status(401)
        .json({ error: 'only creater can delete blog' })
    }

    user.blogs = user.blogs.filter((b) => String(b) !== String(blog._id))
    await user.save()

    await Blog.findByIdAndDelete(blog._id)
    response.status(204).end()
  }
)

module.exports = blogsRouter
