"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getAllPosts = exports.getMePosts = void 0;
const prisma_1 = require("../../extras/prisma");
const posts_types_1 = require("./posts-types");
const getMePosts = async (parameters) => {
    const posts = await prisma_1.prismaClient.post.findMany({
        where: {
            userId: parameters.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return {
        posts,
    };
};
exports.getMePosts = getMePosts;
const getAllPosts = async (parameters) => {
    const limit = 10;
    const offset = (parameters.page - 1) * limit;
    const posts = await prisma_1.prismaClient.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
    });
    return { posts };
};
exports.getAllPosts = getAllPosts;
const createPost = async (parameters) => {
    try {
        const newPost = await prisma_1.prismaClient.post.create({
            data: {
                userId: parameters.userId,
                title: parameters.title,
                description: parameters.description,
                content: parameters.content,
            },
        });
        return { newPost };
    }
    catch (e) {
        throw posts_types_1.createPostError.UNKNOWN;
    }
};
exports.createPost = createPost;
const deletePost = async (parameters) => {
    const post = await prisma_1.prismaClient.post.findUnique({
        where: {
            id: parameters.postId,
        },
    });
    if (!post || post.userId != parameters.userId) {
        throw new Error("Unauthorized to delete this post");
    }
    await prisma_1.prismaClient.post.delete({
        where: {
            id: parameters.postId,
        },
    });
};
exports.deletePost = deletePost;
