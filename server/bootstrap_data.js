// const later = require('later');
const _ = require("lodash");

module.exports = {
  users: [
    {
      username: "simon",
      password: "1234",
      email: "simonarbuckle@hotmail.com",
      displayName: "Simon Arbuckle",
      profile: "admin"
    }
  ],
  versions: [
    {
      key: "Test1",
      description: "Test Descr2",
      status: "Active",
      modified: false,
      timearchived: null,
      datedeleted: null
    }
  ],
  models: [
    {
      key: "Test Model",
      description: "Test Model",
      system: "System1",
      category: "Model",
      owner: "Owner1",
      locations: "{}",
      custom_properties: ""
    },
    {
      key: "Test Model2",
      description: "Test Model",
      system: "System1",
      category: "Model",
      owner: "Owner1",
      locations: "{}",
      custom_properties: ""
    }
  ],
  attributes: [
    {
      key: "test attribute 1",
      description: "changed",
      scope: "Local",
      custom_properties: ""
    },
    {
      key: "test attribute 2",
      description: "test",
      scope: "Global",
      custom_properties: ""
    }
  ]
};
