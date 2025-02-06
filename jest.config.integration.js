module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.integration.ts"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      "^.+\\.ts$": "ts-jest",
    },
  }
  
  