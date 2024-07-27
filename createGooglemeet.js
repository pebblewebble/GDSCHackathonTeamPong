function getUserData(userID){
  var appId = 'APPID';
  var tableName = 'Users';
  var apiKey = 'APIID';

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

function getApplicationData(rowID){
  var appId = 'APPID';
  var tableName = 'Applications';
  var apiKey = 'APIID';

  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
    "Action": "Find",
    "Properties": {
      "Selector": `FILTER(Applications, ([Row ID] = "${rowID}"))`,
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

function getJobData(rowID){
  var appId = 'APPID'
  var tableName = 'Job_Listings';
  var apiKey = 'APIID';

  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
    "Action": "Find",
    "Properties": {
      "Selector": `FILTER(Job_Listings, ([Row ID] = "${rowID}"))`,
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

function getCompanyData(rowID){
  var appId = 'APPID';
  var tableName = 'Company';
  var apiKey = 'APIID';

  var url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  var payload = {
    "Action": "Find",
    "Properties": {
      "Selector": `FILTER(Company, ([Row ID] = "${rowID}"))`,
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

function formatDate(dateStr) {
  var date = new Date(dateStr);
  
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var seconds = date.getSeconds().toString().padStart(2, '0');
  
  var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  formattedDate = formattedDate+"+08:00";
  return formattedDate;
}

function calendar(userData,applicationData,companyData,jobData){
  var cal = CalendarApp.getCalendarById(companyData[0]["Company E-mail"]);
  const cal_id = `${companyData[0]["Company E-mail"]}`;
  const resources = {
    start:{dateTime: formatDate(applicationData[0]["Interview Date and Time"])},
    end:{dateTime: formatDate(applicationData[0]["Interview Date and Time"])},
    attendees: [{email: userData[0]["E-mail"]}],
    conferenceData:{
      createRequest:{
        requestId: "Sample123",
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    summary: `Interview for Position ${jobData[0]["Job Title"]} for ${companyData[0]["Company Name"]}`,
    description:`This is an automatically generated event for the interview scheduled for the company, ${companyData[0]["Company Name"]} `,
  };
  const event = Calendar.Events.insert(resources,cal_id,{
    conferenceDataVersion:1
  });
  var googleMeetLink = event.hangoutLink;
  return googleMeetLink;
}

function setMeetLink(applicationID,meetLink) {
  var appId = 'APPID';
  var tableName = 'Applications';
  var apiKey = 'APIID';

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
      "Row ID": `${applicationID}`,
      "Google Meet": `${meetLink}`
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
}


function main(applicationID,userID,jobID){
  companyData = getCompanyData(jobData[0]["Company Name"]);
  userData = getUserData(userID);
  applicationData = getApplicationData(applicationID);
  meetLink = calendar(userData,applicationData,companyData,jobData);
  setMeetLink(applicationID,meetLink);
}
