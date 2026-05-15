const postRepository = require('../../repositories/posts/post.repository');
const asyncHandler = require('../../middleware/asyncHandler');
const { NotFoundError } = require('../../core/errors/AppError');

const postController = {
  list: asyncHandler(async (req, res) => {
    const posts = await postRepository.findAll(req.query.page, req.query.limit);
    const formatted = posts.map(p => ({
      id: p._id, user: { id: p.user?._id, name: p.user?.name, avatar: p.user?.avatar },
      content: p.content, image: p.image, workoutDetails: p.workoutDetails || null,
      likes: p.likes?.length || 0, comments: p.comments?.length || 0, createdAt: p.createdAt,
      isLiked: req.user ? p.likes?.some(l => l.toString() === req.user.id) : false,
    }));
    res.json(formatted);
  }),

  create: asyncHandler(async (req, res) => {
    const { content, image, workoutDetails, privacy } = req.body;
    const post = await postRepository.create({ user: req.user.id, content, image, workoutDetails, privacy });
    res.status(201).json(post);
  }),

  like: asyncHandler(async (req, res) => {
    const post = await postRepository.findById(req.params.id);
    if (!post) throw new NotFoundError('Post not found');
    const isLiked = post.likes.some(l => l.toString() === req.user.id);
    const updated = isLiked ? await postRepository.removeLike(req.params.id, req.user.id) : await postRepository.addLike(req.params.id, req.user.id);
    res.json(updated);
  }),

  addComment: asyncHandler(async (req, res) => {
    const comment = { user: req.user.id, text: req.body.text, date: new Date() };
    const updated = await postRepository.addComment(req.params.id, comment);
    if (!updated) throw new NotFoundError('Post not found');
    res.json(updated);
  }),

  getComments: asyncHandler(async (req, res) => {
    const post = await postRepository.findById(req.params.id);
    if (!post) throw new NotFoundError('Post not found');
    res.json(post.comments || []);
  }),
};

module.exports = postController;
