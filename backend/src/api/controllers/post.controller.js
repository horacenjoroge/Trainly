const asyncHandler = require('../../middleware/asyncHandler');
const postService = require('../../services/post.service');

function serializeComment(comment) {
  return {
    _id: comment._id,
    userId: comment.user ? {
      _id: comment.user._id,
      id: comment.user._id,
      name: comment.user.name,
      avatar: comment.user.avatar,
    } : null,
    text: comment.text,
    createdAt: comment.date || comment.createdAt || null,
  };
}

function serializePost(post, currentUserId = null) {
  return {
    _id: post._id,
    userId: post.user ? {
      _id: post.user._id,
      id: post.user._id,
      name: post.user.name,
      avatar: post.user.avatar,
    } : null,
    content: post.content,
    image: post.image,
    privacy: post.privacy || 'public',
    workoutDetails: post.workoutDetails || null,
    likes: (post.likes || []).map((like) => like.toString()),
    comments: (post.comments || []).map(serializeComment),
    createdAt: post.createdAt,
    isLiked: currentUserId ? (post.likes || []).some((like) => like.toString() === currentUserId.toString()) : false,
  };
}

const postController = {
  list: asyncHandler(async (req, res) => {
    const posts = await postService.listPosts(req.validated.query);
    const formatted = posts.map((post) => serializePost(post, req.user?.id));
    res.json(formatted);
  }),

  create: asyncHandler(async (req, res) => {
    const post = await postService.createPost(req.user.id, req.validated.body);
    res.status(201).json(serializePost(post, req.user.id));
  }),

  like: asyncHandler(async (req, res) => {
    const updated = await postService.toggleLike(req.validated.params.id, req.user.id);
    res.json(serializePost(updated, req.user.id));
  }),

  addComment: asyncHandler(async (req, res) => {
    const comment = await postService.addComment(req.validated.params.id, req.user.id, req.validated.body.text);
    res.json(serializeComment(comment));
  }),

  getComments: asyncHandler(async (req, res) => {
    const comments = await postService.getComments(req.validated.params.id);
    res.json(comments.map(serializeComment));
  }),
};

module.exports = postController;
