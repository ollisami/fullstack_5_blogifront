const blogs = [
    {
      id: "5a451df7571c224a31b5c8ce",
      author: "test1",
      title: "testTitle",
      url: "testUrl",
      user: {
        _id: "5a437a9e514ab7f168ddf138",
        username: "testUser",
        name: "test test"
      }
    },
    {
        id: "5a451df7571c224a31b5c8ce",
        author: "test2",
        title: "testTitle2",
        url: "testUrl2",
        user: {
          _id: "5a437a9e514ab7f168ddf138",
          username: "testUser2",
          name: "test test2"
        }
      }
  ]
  let token = null
  const setToken = newToken => {
    token = `bearer ${newToken}`
  }
  
  const getAll = () => {
    return Promise.resolve(blogs)
  }
  
  export default { getAll , setToken}