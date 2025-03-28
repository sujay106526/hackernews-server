import type { Comment } from "@prisma/client";  //Define the Comment type manually based on your database schema

export type GetCommentsResult = {
  comments: Comment[];
};

export type CreateCommentResult = {
  comment: Comment;
};

export type UpdateCommentResult = {
  comment: Comment;
};