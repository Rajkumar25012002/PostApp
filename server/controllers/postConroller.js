import postCollection from "../models/postModel.js";
import userCollection from "../models/userModel.js";
import { nanoid } from "nanoid";
export const addPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      datePosted,
      userName,
      userid,
      link,
      images,
      mentions,
    } = req.body;
    const postData = {
      postId: nanoid(),
      userName: userName,
      userid: userid,
      datePosted: datePosted,
      lastUpdated: datePosted,
      title: title,
      content: content,
      link: link,
      images: images,
      mentions: mentions,
    };
    const post = await postCollection.insertMany([postData]);
    res.send(post);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't add post",
    });
  }
};
export const getAllPost = async (_req, res, next) => {
  try {
    const deactivatedUsers = await userCollection.find(
      { isDeactivated: true },
      { userid: 1, _id: 0 }
    );
    const deactivatedUserIds = deactivatedUsers.map((user) => user.userid);
    const posts = await postCollection.find({
      userid: { $nin: deactivatedUserIds },
      retweetedBy: { $nin: deactivatedUserIds },
    });
    res.send(posts);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't get posts",
    });
  }
};
export const addEmoji = async (req, res, next) => {
  try {
    const { postId, feed, userid } = req.body;
    postCollection
      .findOne({ postId: postId })
      .then((post) => {
        if (!post) {
          res.status(400).send({
            error: "Bad Request",
            message: "Post not found",
          });
          return;
        }

        const emojiArray = post[feed] || [];
        const userIndex = emojiArray.indexOf(userid);
        if (userIndex === -1) {
          return postCollection.findOneAndUpdate(
            { postId: postId },
            { $addToSet: { [feed]: userid } },
            { new: true }
          );
        } else {
          emojiArray.splice(userIndex, 1);
          return postCollection.findOneAndUpdate(
            { postId: postId },
            { $set: { [feed]: emojiArray } },
            { new: true }
          );
        }
      })
      .then((updatedPost) => {
        if (updatedPost) {
          res.send(updatedPost);
        } else {
          res.status(400).send({
            error: "Bad Request",
            message: "Post not found/updated",
          });
        }
      });
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't add emoji",
    });
  }
};
export const addComment = async (req, res, next) => {
  try {
    const { postId, comment } = req.body;
    const result = await postCollection.findOneAndUpdate(
      { postId: postId },
      { $push: { comments: comment } },
      { new: true }
    );
    res.send(result);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't add comment",
    });
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { postId, commentId, userId } = req.body;
    let result;
    const post = await postCollection.findOne({
      postId: postId,
    });
    if (post) {
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === commentId
      );
      const comment = post.comments[commentIndex];
      const userIndex =
        comment.likes.length > 0 ? comment.likes.indexOf(userId) : -1;
      if (userIndex === -1) {
        result = await postCollection.findOneAndUpdate(
          { postId: postId, "comments._id": commentId },
          { $push: { "comments.$.likes": userId } },
          { new: true }
        );
        res.send(result);
      } else {
        result = await postCollection.findOneAndUpdate(
          { postId: postId, "comments._id": commentId },
          { $pull: { "comments.$.likes": userId } },
          { new: true }
        );
        res.send(result);
      }
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't add comment like",
    });
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const { postId, title, content, updatedDate, mentions, link, images } =
      req.body;
    const post = await postCollection.findOneAndUpdate(
      { postId: postId },
      {
        $set: {
          title: title,
          content: content,
          lastUpdated: updatedDate,
          mentions: mentions,
          images: images,
          link: link,
        },
      },
      { new: true }
    );
    res.send(post);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't update post",
    });
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const postExists = await postCollection.findOne({ postId: postId });
    if (!postExists) {
      res.status(400).send({
        error: "Bad Request",
        message: "Post does not exist",
      });
    }
    const post = await postCollection.deleteOne({ postId: postId });
    res.send(postId);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't delete post",
    });
  }
};
export const retweetedPost = async (req, res, next) => {
  try {
    const {
      postId,
      userid,
      title,
      content,
      datePosted,
      retweetedBy,
      isRetweet,
      mentions,
      link,
      images,
    } = req.body;
    const postPresent = await postCollection.findOne({ postId: postId });
    const retweetArray = postPresent.shares || [];
    const userIndex = retweetArray.indexOf(retweetedBy);
    let postRetweet = null,
      post;
    if (userIndex === -1) {
      postRetweet = await postCollection.create({
        postId: nanoid(),
        userid,
        title,
        content,
        datePosted,
        mentions,
        link,
        images,
        isRetweet: isRetweet,
        retweetedBy: retweetedBy,
        originalPostId: postId,
      });
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $push: { shares: retweetedBy },
        },
        { new: true }
      );
    } else {
      await postCollection.deleteOne({
        $and: [{ originalPostId: postId }, { retweetedBy: retweetedBy }],
      });
      retweetArray.splice(userIndex, 1);
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $set: { shares: retweetArray },
        },
        { new: true }
      );
    }
    return res.send({ post, postRetweet, postId, retweetedBy });
  } catch (err) {
    next(err);
    return res.status(400).send({ message: "Can't rewteet" });
  }
};
