Feature: Create Instant Meeting
  As a logged-in user
  I want to create an instant meeting
  So that I can start a video call immediately

  Background:
    Given the application is running
    And I am logged in as a user "alejandro@example.com"
    And I am on my dashboard

  # --------------------------
  # SCENARIO: Successful creation
  # --------------------------
  Scenario: Start an instant meeting successfully
    When I click "Start Meeting"
    Then the system should generate a unique meeting room
    And I should be redirected to the meeting room
    And the meeting URL should match the pattern "/meeting/{meetingId}"
    And I should see my meeting controls (camera, microphone, participants list)

  # --------------------------
  # SCENARIO: Meeting service unavailable
  # --------------------------
  Scenario: Start meeting fails when meeting service is down
    Given the meeting service is unavailable
    When I click "Start Meeting"
    Then I should see an error message "Unable to start meeting. Please try again later."
    And I should remain on the dashboard

  # --------------------------
  # SCENARIO: User not authenticated
  # --------------------------
  Scenario: Start meeting is blocked for unauthenticated users
    Given I am logged out
    And I am on the dashboard
    When I click "Start Meeting"
    Then I should be redirected to the login page
    And I should see a message "Please log in to start a meeting"

  # --------------------------
  # SCENARIO: User reached active meeting limit
  # --------------------------
  Scenario: Start meeting fails when user has reached active meeting limit
    Given I have already N active meetings
    When I click "Start Meeting"
    Then I should see an error message "You have reached the maximum number of active meetings"
    And I should remain on the dashboard

  # --------------------------
  # SCENARIO: Media permissions denied
  # --------------------------
  Scenario: Start meeting when camera/microphone permissions are denied
    Given my browser blocks camera and microphone permissions
    When I click "Start Meeting"
    Then a permissions prompt should be shown asking for camera and microphone access
    And I should be placed in the meeting room in muted / video-off state
    And I should see a visible indicator that media is disabled

  # --------------------------
  # SCENARIO: Redirect preserves query params / deep link
  # --------------------------
  Scenario: Start meeting preserves deep-link parameters
    Given I opened the dashboard with query parameter "utm=campaign"
    When I click "Start Meeting"
    Then the meeting URL should include the query parameter "utm=campaign"

  # --------------------------
  # SCENARIO: Meeting room uniqueness (concurrent creation)
  # --------------------------
  Scenario: Two instant meetings created sequentially produce unique room IDs
    When I click "Start Meeting"
    And I copy the meeting URL as "firstUrl"
    And I navigate back to the dashboard
    And I click "Start Meeting"
    And I copy the meeting URL as "secondUrl"
    Then "firstUrl" should not equal "secondUrl"

  # --------------------------
  # SCENARIO: Invitation link is available after creation
  # --------------------------
  Scenario: Meeting creation provides an invitation link
    When I click "Start Meeting"
    Then I should see a sharable invite link
    And I should be able to copy the invite link to clipboard
