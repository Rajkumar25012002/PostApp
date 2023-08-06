import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  authorId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const postSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  originalPostId: {
    type: String,
  },
  userName: {
    type: String,
  },
  userid: {
    type: String,
  },
  datePosted: {
    type: String,
  },
  lastUpdated: {
    type: String,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  likes: [
    {type: String}
  ],
  dislikes:[
    {type: String}
  ],
  comments: [commentSchema],
  shares: [
    {type: String}
  ],
  isRetweet: {
    type: Boolean,
    default: false,
  },
  retweetedBy: {
    type: String
  }
});
const postCollection = mongoose.model("post", postSchema);
export default postCollection;
