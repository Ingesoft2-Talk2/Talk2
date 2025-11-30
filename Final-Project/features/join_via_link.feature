Feature: Join via link
  As a participant
  I want to join a meeting using its link
  So that I can access the call quickly without scheduling

  Background:
    Given the application is running

  # --------------------------
  # SCENARIO: Happy path — direct join with valid link
  # --------------------------
  Scenario: Join meeting directly using a valid meeting link
    Given I have a valid meeting link
    When I click the meeting link
    Then the system must open the meeting room
    And I should see my video/audio join controls
    And the meeting URL should match the link I clicked

  # --------------------------
  # SCENARIO: Waiting room when admission required
  # --------------------------
  Scenario: Join meeting via link that requires host admission
    Given I have a valid meeting link for a meeting that requires admission
    When I click the meeting link
    Then I should be placed in the waiting room
    And the host should receive a join request notification
    And I should see a message "Waiting for the host to admit you"

  # --------------------------
  # SCENARIO: Redirect to login when not authenticated (magic link vs auth-required)
  # --------------------------
  Scenario: Link requires authentication — redirect to login and return
    Given the meeting link requires an authenticated user
    And I am not logged in
    When I click the meeting link
    Then I should be redirected to the login page
    And after successful login I should be redirected to the meeting or waiting room

  # --------------------------
  # SCENARIO: Invalid or malformed link
  # --------------------------
  Scenario: Attempt to join with an invalid or malformed link
    Given I have an invalid meeting link
    When I click the meeting link
    Then I should see an error message "Invalid meeting link"
    And I should not be placed in any meeting

  # --------------------------
  # SCENARIO: Expired meeting link
  # --------------------------
  Scenario: Attempt to join with an expired meeting link
    Given I have a meeting link that has expired
    When I click the meeting link
    Then I should see an error message "This meeting link has expired"
    And I should be given an option to request a new invite or contact the host

  # --------------------------
  # SCENARIO: Link with token tampering or invalid signature
  # --------------------------
  Scenario: Join fails when link token is tampered with
    Given I have a meeting link with a tampered token
    When I click the meeting link
    Then I should see an error message "Invalid or tampered link"
    And the join attempt should be logged for security review

  # --------------------------
  # SCENARIO: Meeting full
  # --------------------------
  Scenario: Join attempt when meeting has reached maximum capacity
    Given the meeting has reached maximum participants
    And I have a valid meeting link
    When I click the meeting link
    Then I should see a message "Meeting is full"
    And I should not be admitted

  # --------------------------
  # SCENARIO: Banned or blocked participant
  # --------------------------
  Scenario: Join blocked for banned user even with a valid link
    Given my account "blocked_user@example.com" is banned from the meeting
    And I have a valid meeting link
    When I click the meeting link
    Then I should see a message "You are not allowed to join this meeting"
    And the join attempt should be denied

  # --------------------------
  # SCENARIO: Link includes passcode / PIN required
  # --------------------------
  Scenario: Join link requires a passcode embedded or prompted
    Given the meeting link requires a passcode
    When I click the meeting link
    Then I should be prompted to enter the passcode
    And upon entering the correct passcode I should be admitted or placed in the waiting room per meeting settings

  # --------------------------
  # SCENARIO: Deep link behavior (mobile app installed)
  # --------------------------
  Scenario: Mobile deep link opens native app when installed
    Given I have the mobile app installed and the link is a mobile deep link
    When I click the meeting link on my mobile device
    Then the native app should open and join the meeting or waiting room
    And query parameters (utm / invite id) should be preserved

  # --------------------------
  # SCENARIO: Desktop vs. new tab behavior
  # --------------------------
  Scenario: Link opens in a new browser tab and preserves session
    Given I am logged in on the desktop browser
    When I click the meeting link in a new tab
    Then the new tab should join the meeting and share my authenticated session

  # --------------------------
  # SCENARIO: Join with limited permissions (camera/microphone blocked)
  # --------------------------
  Scenario: Join when browser blocks camera/microphone permissions
    Given my browser blocks camera and microphone permissions
    And I have a valid meeting link
    When I click the meeting link
    Then I should still be placed in the meeting or waiting room
    And I should see a prompt or UI message indicating media permissions are blocked

  # --------------------------
  # SCENARIO: Preserve query parameters / referral info
  # --------------------------
  Scenario: Link with tracking params preserves query params on join
    Given I have a meeting link with "?utm=invite&ref=campaign"
    When I click the meeting link
    Then the meeting join should preserve the query parameters for analytics

  # --------------------------
  # SCENARIO: Reconnection using the same link
  # --------------------------
  Scenario: Rejoin the meeting using the same link after disconnection
    Given I joined the meeting via link and was disconnected
    When I click the same meeting link again
    Then I should be able to rejoin the meeting, subject to host admission or capacity limits

  # --------------------------
  # SCENARIO: Single-use vs. multi-use invite links
  # --------------------------
  Scenario: Single-use invite link cannot be reused
    Given I have a single-use meeting link and someone else already used it
    When I click the meeting link
    Then I should see a message "This meeting link has already been used"
    And I should not be admitted

  # --------------------------
  # SCENARIO: SSO / enterprise link handling
  # --------------------------
  Scenario: Enterprise (SSO) meeting link redirects to SSO and returns to meeting
    Given the meeting link is protected by SSO
    And I am not authenticated
    When I click the meeting link
    Then I should be redirected to the SSO provider
    And after successful SSO login I should be redirected to the meeting or waiting room

  # --------------------------
  # SCENARIO: Accessibility — screen reader announces waiting state
  # --------------------------
  Scenario: Screen reader announces that the user is in the waiting room
    Given I have a valid meeting link for a meeting requiring admission
    When I click the meeting link
    Then the waiting room should present an accessible message "You are in the waiting room" for assistive tech

  # --------------------------
  # SCENARIO: Audit logging and analytics
  # --------------------------
  Scenario: Clicking a meeting link is logged for audit and analytics
    Given I have a valid meeting link
    When I click the meeting link
    Then the system should log the join attempt with timestamp and source
