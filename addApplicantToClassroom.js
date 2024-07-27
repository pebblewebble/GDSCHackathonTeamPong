function getUserData(userID){
  var appId = 'APPID';
  var tableName = 'Users';
  var apiKey = 'APIKEY';

  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
    "Action": "Find",
    "Properties": {
      "Selector": `FILTER(Users, ([Row ID] = "${userID}"))`,
      "Locale": "en-US",
      "Location": "47.623098, -122.330184",
      "Timezone": "Pacific Standard Time"
    },
    "Rows": []
  };

  var options = {
    "method": "get",
    "headers": {
      "applicationAccessKey": apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseContent = response.getContentText();
  var parsedContent = JSON.parse(responseContent);
  return parsedContent;
}

function getClassroomID(jobID){
    var appId = 'APPID';
    var tableName = 'Job_listings';
    var apiKey = 'APIKEY';

    var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

    var payload = {
      "Action": "Find",
      "Properties": {
        "Selector": `FILTER(Job_Listings, ([Row ID] = "${jobID}"))`,
        "Locale": "en-US",
        "Location": "47.623098, -122.330184",
        "Timezone": "Pacific Standard Time"
      },
      "Rows": []
    };

    var options = {
      "method": "get",
      "headers": {
        "applicationAccessKey": apiKey,
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseContent = response.getContentText();
    var parsedContent = JSON.parse(responseContent);
    return parsedContent[0]["Google Classroom ID"];
  }

  function addStudentToClassroom(courseID, studentEmail) {
    const invitation = Classroom.newInvitation();
    invitation.courseId = courseID;
    invitation.role = 'STUDENT';
    //Currently static for testing purposes
    invitation.userId=studentEmail;
    //invitation.userId = "peterpan123344@gmail.com";
    Classroom.Invitations.create(invitation);
  }
function main(jobID,userID){
  userData = getUserData(userID);
  courseID = getClassroomID(jobID);
  addStudentToClassroom(courseID,userData[0]["E-mail"]);
}