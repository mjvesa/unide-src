module.exports = {
  verbose: true,
  moduleDirectories: ["node_modules", "src", "test"],
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
  testEnvironment: "jsdom",
};
