var dynamoose = require('dynamoose');

let Image = dynamoose.model('Images2', { 
  image_id: String, 
  image_name: String,
  image_owner: String,
  image_desc: String

});

  module.exports = Image;