OWNER_EMAIL = "ericlye27@gmail.com"



function getLastRow(){
  var appId = 'APPID';
  var tableName = 'Job_Listings';
  var apiKey = 'APIKEY';

  // API URL to perform the action on the specified table
  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
  "Action": "Find",
  "Properties": {
    "Selector": "TOP(SELECT(Job_Listings[Row ID], TRUE), 100)",
    "Locale": "en-US",
    "Location": "47.623098, -122.330184",
    "Timezone": "Pacific Standard Time"
  },
  "Rows": []
};

  // Set up the request options, including headers and payload
  var options = {
    "method": "get",
    "headers": {
      "applicationAccessKey": apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  // Make the API request and log the response
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getResponseCode()); // Log the response code for debugging

  // Parse and pretty-print the response content
  var responseContent = response.getContentText();
  var parsedContent = JSON.parse(responseContent);
  parsedContent = parsedContent[parsedContent.length-1];

  //Logger.log(parsedContent[0]['Platform']);
  //Logger.log(JSON.stringify(parsedContent, null, 2)); // Pretty-print the JSON content
  return parsedContent;
}

function getCompanyData(companyID){
  var appId = 'APPID';
  var tableName = 'Company';
  var apiKey = 'APIKEY';

  // API URL to perform the action on the specified table
  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
    "Action": "Find",
    "Properties": {
      "Selector": `FILTER(Company, ([Row ID] = "${companyID}"))`,
      "Locale": "en-US",
      "Location": "47.623098, -122.330184",
      "Timezone": "Pacific Standard Time"
    },
    "Rows": []
  };

  // Set up the request options, including headers and payload
  var options = {
    "method": "get",
    "headers": {
      "applicationAccessKey": apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  // Make the API request and log the response
  var response = UrlFetchApp.fetch(url, options);
  var responseContent = response.getContentText();
  var parsedContent = JSON.parse(responseContent);
  return parsedContent;
}


function detectPlatformType(data){
  if(data['Platform']=="Google Classroom"){
    createGoogleClassroom(data);
  }
}

function createGoogleClassroom(data){
  const newCourse = Classroom.newCourse();
  newCourse.name = data['Job Title'];
  newCourse.section = getCompanyData(data['Company Name'])[0]['Company Name'];
  newCourse.description = `This is a classroom automatically created for the interview for the following company: ${getCompanyData(data['Company Name'])[0]['Company Name']}`;
  newCourse.ownerId=OWNER_EMAIL;
  const createdClass = Classroom.Courses.create(newCourse);
  const courseID = createdClass.id;
  const invitation = Classroom.newInvitation();
  invitation.courseId=courseID;
  invitation.role='TEACHER';
  //REMEMBER TO UNCOMMENT TO BE DYNAMIC, CURRENTLY STATIC FOR TESTING
  //invitation.userId=getCompanyData(data[0]['Company Name'])[0]['Company E-mail']; 
  invitation.userId="peterpan123344@gmail.com";
  Classroom.Invitations.create(invitation);
  //Logger.log(createdClass.enrollmentCode);
  //const CLASS_DATA=Classroom.Courses.list().courses;
  //Logger.log(CLASS_DATA);
  addCourseID(courseID,data);
  createInterviewQuestions(courseID,data);
}

function addCourseID(courseID,data) {
  var appId = 'APPID';
  var tableName = 'Job_Listings';
  var apiKey = 'APIKEY';

  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
  "Action": "Edit",
  "Properties": {
    "Selector": "",
    "Locale": "en-US",
    "Location": "47.623098, -122.330184",
    "Timezone": "Pacific Standard Time"
  },
  "Rows": [
    {
      "Row ID": `${data["Row ID"]}`,
      "Google Classroom ID": `${courseID}`
    }
  ]
};

  // Set up the request options, including headers and payload
  var options = {
    "method": "post",
    "headers": {
      "applicationAccessKey": apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  // Make the API request and log the response
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getResponseCode()); // Log the response code for debugging

  // Parse and pretty-print the response content
  var responseContent = response.getContentText();
  var parsedContent = JSON.parse(responseContent);
  //Logger.log(JSON.stringify(parsedContent, null, 2)); // Pretty-print the JSON content
  //return parsedContent;

}

function createInterviewQuestions(courseID,data){
  const courseWork = Classroom.newCourseWork();
  courseWork.title = `Interview Questions for Position ${data['Job Title']} in ${getCompanyData(data['Company Name'])[0]['Company Name']}`;
  courseWork.description = "";
  courseWork.workType = 'ASSIGNMENT';
  courseWork.state = 'PUBLISHED';

  var prompt = "";

  if(data['Interview Questions']=="Basic + Programming Questions"){



    prompt = "Please generate basic interview questions by following these examples given, ensure that you do not ask anything technical about programming but just general interests and their experience for the first 5 questions and then followed by interview programming questions later, for 5 questions as well , please format the questions according to the examples given as well. Just purely the questions, no heading and other text and always make sure to start from question 1. Question 1: What do you enjoy about programming? Question 2: What are your strengths in programming? Question 3: What are some of the challenges you have faced in programming?Question 4: Can you share your experience about your favorite programming project?Question 5: What do you think you can offer in our company?Question 6: Why did you choose our company? Question 6: Please code and show us how to reverse a linked list in your desired coding language. Question 7: Please code and show us how to implement a bubble sort. Question 8: Please code and show us how to reverse an array. Question 9: Please code and show us how to find the middle element of a linked list. Question 10: Please code and show us how to merge two linked lists.";
  
  
  
  }else if(data['Interview Questions']=="Basic Questions"){



    prompt="Please generate basic interview questions by following these examples given, ensure that you do not ask anything technical about programming but just general interests and their experience, please format the questions according to the examples given as well. Just purely the questions, no heading and other text and always make sure to start from question 1. Question 1: What do you enjoy about programming? Question 2: What are your strengths in programming? Question 3: What are some of the challenges you have faced in programming?Question 4: Can you share your experience about your favorite programming project?Question 5: What do you think you can offer in our company?Question 6: Why did you choose our company?";
  
  
  
  }else if(data['Interview Questions']=="Programming Questions"){



    prompt="Please generate programming interview questions by following these examples given, ensure that you do not ask general questions, only technical programming interview questions , please format the questions according to the examples given as well. Just purely the questions, no heading and other text and always make sure to start from question 1. Question 1: Why did you choose our company? Question 2: Please code and show us how to reverse a linked list in your desired coding language. Question 3: Please code and show us how to implement a bubble sort. Question 4: Please code and show us how to reverse an array. Question 5: Please code and show us how to find the middle element of a linked list. Question 6: Please code and show us how to merge two linked lists.";
  
  
  
  }else{
    //End if manual 
    return "";
  }
  var apiKey = "GEMINIAPIKEY";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
  var url = apiUrl +"?key="+apiKey;

  var headers = {
    "Content-Type": "application/json"
  };

  var requestBody = {
    "contents": [
        {
            "parts": [
                {
                    "text": `${prompt}`
                }
            ]
        }
    ]
};
  var options = {

    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)
  };

  var response = UrlFetchApp.fetch(url,options);
  var data = JSON.parse(response.getContentText());
  var output = data.candidates[0].content.parts[0].text;
  Logger.log(output);
  courseWork.description=output+"\nPlease attach any relevant files such as the code(if required by the company) OR answers to the questions.";
  const createdCourseWork = Classroom.Courses.CourseWork.create(courseWork, courseID);
}


function main(){
  var response = getLastRow();
  detectPlatformType(response);
}


