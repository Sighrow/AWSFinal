var dynamoose = require('dynamoose');

let User = dynamoose.model('Users3', { user_name: String, user_email: String });

  module.exports = User;