if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://max:******@ds127888.mlab.com:27888/eureka-prod'
  }
}
else {
  module.exports = {
    mongoURI: 'mongodb://localhost/eureka-dev'
  }
}
