const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({
  region: "us-east-1",
});
const ddbDocClient = DynamoDBDocument.from(dbClient);
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

module.exports.getAllNotes = async function (event) {
  try {
    const res = await ddbDocClient.scan({
      TableName: NOTES_TABLE_NAME,
    });

    return send(200, { items: res.Items });
  } catch (error) {
    return send(500, { error: error.message });
  }
};

module.exports.getNote = async function (event) {
  let notesId = event.pathParameters.id;
  try {
    const res = await ddbDocClient.get({
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
    });
    return send(200, { item: res.Item });
  } catch (error) {
    return send(500, { error: error.message });
  }
};
module.exports.createNote = async function (event) {
  let data = JSON.parse(event.body);

  try {
    const res = await ddbDocClient.put({
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    });
    return send(201, {
      message: "Note created",
      result: res,
    });
  } catch (error) {
    return send(500, { error: error.message });
  }
};

module.exports.updateNote = async function (event) {
  let notesId = event.pathParameters.id;
  const item = JSON.parse(event.body);
  try {
    const res = await ddbDocClient.update({
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId,
      },
      UpdateExpression: "set title = :title, body = :body",
      ExpressionAttributeValues: {
        ":title": item.title,
        ":body": item.body,
      },
      ReturnValues: "UPDATED_NEW",
      ConditionExpression: "attribute_exists(notesId)",
    });

    return send(200, { updated: res.Attributes });
  } catch (error) {
    return send(500, { error: error.message });
  }
};

module.exports.deleteNote = async function (event) {
  let notesId = event.pathParameters.id;

  try {
    const res = await ddbDocClient.delete({
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
    });

    return send(200, { deleted: res });
  } catch (error) {
    return send(500, { error: error.message });
  }
};

function send(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
