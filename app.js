"use strict";
let core = require("./lib"); // will be require("labs_core"); in real project

core(
  function* (labs) {
    let app = yield labs.dependency("app");

    app.get("/custom", function* () {
      this.body = "custom endpoint";
    });
  },
  function (error) {
    if(error){
      console.error(error.stack);
    }
  }
);
