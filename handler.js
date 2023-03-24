module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "All notes",
      input: event,
    }),
  };
};

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Create note",
      input: event,
    }),
  };
};

module.exports.updateNote = async (event) => {
  let notesId = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Update note with id: ${notesId}`,
      input: event,
    }),
  };
};

module.exports.deleteNote = async (event) => {
  let notesId = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Deleted note with id: ${notesId}`,
      input: event,
    }),
  };
};
