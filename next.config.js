module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    node_env: process.env.NODE_ENV,
  },
}
