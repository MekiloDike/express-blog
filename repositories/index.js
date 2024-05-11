const BlogModel = require("../models/blog.model");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const createUser = async (first_name, last_name, email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const newuser = new UserModel({
    first_name,
    last_name,
    email,
    password: hashedpassword,
  });
  const user = await newuser.save();
  if (user) {
    return user;
  } else {
    throw new Error("User not found");
}
};

const getUserForLogin = async (email) => {
    try {
        const user = await UserModel.findOne({ email }).exec();
        if (user) return user;
    } catch (error) {
        throw new Error("User not found");        
    }
}

const getUser = async (id) => {
  try {
    const user = await UserModel.findById(id, { password: 0 });
    // .populate('stack');
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const createBlog = async (body, author, title, tags, description) => {
  const newuser = new BlogModel({
    body,
    author,
    title,
    tags,
    description,
  });
  const blog = await newuser.save();
  if (blog) {
    return blog;
  } else {
    throw new Error("Blog not found");
  }
};

const getBlogById = async (id) => {
  try {
    const blog = await BlogModel.findById(id).populate("author");
    if (blog) {
      blog.read_count = blog.read_count + 1;
      blog.save();
      return blog;
    } else {
      throw new Error("Blog not found");
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const editBlog = async (id, body, state, title, tags, description) => {
  try {
    const blog = await BlogModel.findById(id);
    blog.title = title;
    blog.description = description;
    blog.tags = tags;
    blog.title = title;
    blog.state = state;
    blog.body = body;
    return await blog.save();
  } catch (error) {
    throw new Error("Blog not found");
  }
};

const deleteBlog = async (id) => {
  try {
    const dl = await BlogModel.findByIdAndDelete(id);
    return dl;
  } catch (error) {
    throw new Error("Blog not found");
  }
};

/**
 * find a blog by its author, title, tags
 * @param {Object} filter // {author: string} || {title: string} || {tags: string} || {state: string}
 * @param {number} page - page number
 * @param {string} orderB - would be like "read_count", "reading_time" or "created_at"
 * @returns {Document}
 */
const findBlog = async (filter, page, orderBy) => {
  try {
    const blog = BlogModel.find(
      filter,
      null,
      page ? { skip: page - 1 * 20 } : undefined
    )
      .limit(20)
    if(orderBy) {
        blog.sort({ [`${orderBy}`]: 1})
    }
    return await blog.exec()
  } catch (error) {}
};

module.exports = {
    findBlog,
    deleteBlog,
    editBlog,
    getBlogById,
    getUser,
    createUser,
    createBlog,
    getUserForLogin,
}