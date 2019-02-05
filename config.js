exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/tracker-app";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/tracker-app-test";
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = "SKIING"

//DATABASE_URL= mongodb://dbuser:password2 @ds163764.mlab.com:63764/workout-tracker-app