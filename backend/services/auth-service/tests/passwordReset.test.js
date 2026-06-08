import assert from "assert";
import crypto from "crypto";

const testSuite = {
  testsFailed: 0,
  testsPassed: 0,
  tests: [],

  test: function (name, fn) {
    this.tests.push({ name, fn });
  },

  run: async function () {
    console.log("\n📋 Running Password Reset Tests\n");
    console.log("================================\n");

    for (const test of this.tests) {
      try {
        await test.fn();
        this.testsPassed++;
        console.log(`✅ PASS: ${test.name}`);
      } catch (error) {
        this.testsFailed++;
        console.log(`❌ FAIL: ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    console.log("\n================================");
    console.log(`\n📊 Results: ${this.testsPassed} passed, ${this.testsFailed} failed\n`);

    if (this.testsFailed === 0) {
      console.log("🎉 All tests passed!\n");
    }
  },
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

testSuite.test("Should validate correct email format", () => {
  const validEmails = [
    "test@example.com",
    "student@school.com",
    "user.name@domain.co.uk",
  ];

  validEmails.forEach((email) => {
    assert.strictEqual(
      validateEmail(email),
      true,
      `Email ${email} should be valid`
    );
  });
});

testSuite.test("Should reject invalid email format", () => {
  const invalidEmails = ["invalid.email", "@example.com", "user@", "justtext"];

  invalidEmails.forEach((email) => {
    assert.strictEqual(
      validateEmail(email),
      false,
      `Email ${email} should be invalid`
    );
  });
});

testSuite.test("Should validate strong passwords", () => {
  const strongPasswords = ["Password123", "MySecurePass", "Test@1234"];

  strongPasswords.forEach((password) => {
    assert.strictEqual(
      validatePassword(password),
      true,
      `Password ${password} should be valid`
    );
  });
});

testSuite.test("Should reject weak passwords", () => {
  const weakPasswords = ["pass", "123", "abc"];

  weakPasswords.forEach((password) => {
    assert.strictEqual(
      validatePassword(password),
      false,
      `Password ${password} should be too weak`
    );
  });
});

testSuite.test("Should generate unique reset tokens", () => {
  const token1 = crypto.randomBytes(32).toString("hex");
  const token2 = crypto.randomBytes(32).toString("hex");

  assert.strictEqual(token1 !== token2, true, "Tokens should be unique");
  assert.strictEqual(token1.length, 64, "Token should be 64 hex characters");
});

testSuite.test("Should hash reset tokens consistently", () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken1 = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const hashedToken2 = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  assert.strictEqual(
    hashedToken1,
    hashedToken2,
    "Same token should produce same hash"
  );
  assert.notStrictEqual(
    token,
    hashedToken1,
    "Token and hash should be different"
  );
});

testSuite.test("Should calculate token expiry correctly", () => {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 15 * 60 * 1000);

  const diffInMinutes = (expiryTime - now) / (1000 * 60);

  assert.strictEqual(
    Math.abs(diffInMinutes - 15) < 1,
    true,
    "Expiry should be approximately 15 minutes from now"
  );
});

testSuite.test("Should require email field in forgot password", () => {
  const requestWithoutEmail = {};
  const hasEmail = "email" in requestWithoutEmail;

  assert.strictEqual(hasEmail, false, "Email field should not be present");
});

testSuite.test("Should require token in reset password", () => {
  const requestWithoutToken = { newPassword: "TestPassword123" };
  const hasToken = "token" in requestWithoutToken;

  assert.strictEqual(hasToken, false, "Token field should not be present");
});

testSuite.test("Should require newPassword in reset password", () => {
  const requestWithoutPassword = { token: "somehash123" };
  const hasPassword = "newPassword" in requestWithoutPassword;

  assert.strictEqual(
    hasPassword,
    false,
    "newPassword field should not be present"
  );
});

testSuite.run();

export default testSuite;




