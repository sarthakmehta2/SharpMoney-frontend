const zod = require("zod");

const createPost = zod.object({
    title: zod.string().min(1),
    description: zod.string().min(1),
    published: zod.string().min(1),

})

const users = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1)
});

module.exports = {
    createPost: createPost,
    users: users
}