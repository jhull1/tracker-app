exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/tracker-app";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/tracker-app-test";
exports.PORT = process.env.PORT || 8080;

//exports.JWT_SECRET = "SKIING"

exports.JWT_SECRET = process.env.JWT_SECRET || 'skiing';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

//DATABASE_URL= mongodb://dbuser:password2 @ds163764.mlab.com:63764/workout-tracker-app