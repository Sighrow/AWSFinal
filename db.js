var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var uuid = require('uuid');
var session = require('express-session');
var s3 = require('s3');
var awsS3Client = new AWS.S3({apiVersion: '2012-08-10'});
var options = {
  s3Client: awsS3Client
};
var client = s3.createClient(options);

module.exports.getItems = function(){

  var params = {
    ExpressionAttributeValues: {
      ':owner': {S: 'sairo'},
      ':name' : {S: '1'}
     },
   KeyConditionExpression: 'image_name = :name',
   ProjectionExpression: 'image_name, image_desc, image_id',
   FilterExpression: 'contains (image_owner, :owner)',
   TableName: 'Images2'
  };
  
  ddb.query(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      data.Items.forEach(function(element, index, array) {
        console.log(element);
      });
    }
  });
}

module.exports.sendText = function(number, username){
var sns = new AWS.SNS();
var params = {
    Message: 'Hi ' + username + '! Thank you for registering!',
    MessageStructure: 'string',
    PhoneNumber: "1" + number,
    Subject: 'Welcome!'
};

sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
});
}

module.exports.sendEmail = function(email, username){

var params = {
  Destination: {
    CcAddresses: [
    ],
    ToAddresses: [
      email
    ]
  },
  Message: {
    Body: {
      Html: {
       Charset: "UTF-8",
       Data: "Hi " + username + "! Thank you for registering!"
      },
      Text: {
       Charset: "UTF-8",
       Data: "Hi " + username + "! Thank you for registering!"
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Welcome, ' + username + '!'
     }
    },
  Source: 'ajspano@email.neit.edu',
  ReplyToAddresses: [
    'ajspano@email.neit.edu',
  ],
};       

var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}