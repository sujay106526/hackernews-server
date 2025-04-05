"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithUsernameAndPassword = exports.signUpWithUsernameAndpassword = exports.createPasswordHash = exports.checkIfUserExistsAlready = void 0;
const crypto_1 = require("crypto");
const authentication_types_1 = require("./authentication-types");
const jwt = require("jsonwebtoken");
const environment_1 = require("../../../environment");
const prisma_1 = require("../../extras/prisma");
const createJWToken = (parameters) => {
    // Generate token
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jwt.sign(jwtPayload, environment_1.jwtsecretKey, {
        expiresIn: "30d",
    });
    return token;
};
const checkIfUserExistsAlready = async (parameters) => {
    const existingUser = await prisma_1.prismaClient.user.findUnique({
        where: {
            username: parameters.username,
        },
    });
    if (existingUser) {
        return true;
    }
    return false;
};
exports.checkIfUserExistsAlready = checkIfUserExistsAlready;
const createPasswordHash = (parameters) => {
    return (0, crypto_1.createHash)("sha256").update(parameters.password).digest("hex");
};
exports.createPasswordHash = createPasswordHash;
const signUpWithUsernameAndpassword = async (parameters) => {
    try {
        const isUserExistingAlready = await (0, exports.checkIfUserExistsAlready)({
            username: parameters.username,
        });
        if (isUserExistingAlready) {
            throw authentication_types_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const passwordHash = (0, exports.createPasswordHash)({
            password: parameters.password,
        });
        const user = await prisma_1.prismaClient.user.create({
            data: {
                username: parameters.username,
                password: passwordHash,
            },
        });
        const token = createJWToken({
            id: user.id,
            username: user.username,
        });
        const result = {
            token,
            user,
        };
        return result;
    }
    catch (e) {
        console.log("Error", e);
        throw authentication_types_1.SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
exports.signUpWithUsernameAndpassword = signUpWithUsernameAndpassword;
const logInWithUsernameAndPassword = async (parameters) => {
    const passwordHash = (0, exports.createPasswordHash)({
        password: parameters.password,
    });
    const user = await prisma_1.prismaClient.user.findUnique({
        where: {
            username: parameters.username,
            password: passwordHash,
        },
    });
    if (!user) {
        throw authentication_types_1.LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
    }
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    return {
        token,
        user,
    };
};
exports.logInWithUsernameAndPassword = logInWithUsernameAndPassword;
