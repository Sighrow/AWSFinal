var dynamoose = require('dynamoose');

let Follow = dynamoose.model('Followers', { 
  follow_id: String, 
  follower_name: String,
  followee_name: String
});

  module.exports = Follow;