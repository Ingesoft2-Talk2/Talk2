Feature: User Registration
  As a new user
  I want to sign up using my email and password
  So that I can create an account and access the platform

  Background:
    Given the application is running
    And I am on the sign-up page


  # --------------------------
  # SCENARIO: Successful sign up
  # --------------------------
  Scenario: Successful sign up with valid email and password
    When I enter a valid email "alejandro@example.com" and password "Str0ngP@ss!"
    And I click "Sign Up"
    Then my account must be created
    And I should be redirected to the dashboard
    And I should see a welcome message "Welcome, Alejandro"


  # --------------------------
  # SCENARIO: Invalid email format
  # --------------------------
  Scenario: Sign up fails due to invalid email format
    When I enter an invalid email "alejandroexample.com" and password "Str0ngP@ss!"
    And I click "Sign Up"
    Then I should see an error message "Invalid email format"
    And my account must not be created


  # --------------------------
  # SCENARIO: Weak password
  # --------------------------
  Scenario: Sign up fails due to weak password
    When I enter a valid email "alejandro@example.com" and a weak password "12345"
    And I click "Sign Up"
    Then I should see an error message "Password is too weak"
    And my account must not be created


  # --------------------------
  # SCENARIO: User already exists
  # --------------------------
  Scenario: Sign up fails because the email is already registered
    Given an account already exists with email "alejandro@example.com"
    When I enter a valid email "alejandro@example.com" and password "Str0ngP@ss!"
    And I click "Sign Up"
    Then I should see an error message "Email already in use"
    And I should remain on the sign-up page


  # --------------------------
  # SCENARIO: Missing fields
  # --------------------------
  Scenario: Sign up fails because fields are empty
    When I leave the email and password fields empty
    And I click "Sign Up"
    Then I should see an error message "Fields cannot be empty"
    And my account must not be created


  # --------------------------
  # SCENARIO: Password confirmation mismatch
  # --------------------------
  Scenario: Sign up fails due to password confirmation mismatch
    When I enter a valid email "alejandro@example.com"
    And I enter password "Str0ngP@ss!" and confirm password "Str0ng123"
    And I click "Sign Up"
    Then I should see an error message "Passwords do not match"
    And my account must not be created


  # --------------------------
  # SCENARIO: Terms and conditions not accepted
  # --------------------------
  Scenario: Sign up fails because terms and conditions are not accepted
    When I enter a valid email "alejandro@example.com" and password "Str0ngP@ss!"
    And I do not accept the terms and conditions
    And I click "Sign Up"
    Then I should see an error message "You must accept the terms and conditions"
    And my account must not be created
