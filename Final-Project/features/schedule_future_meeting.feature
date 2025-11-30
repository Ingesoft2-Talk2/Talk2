Feature: Schedule Future Meeting
  As a user
  I want to schedule a meeting for a specific date and time
  So that I can plan events in advance

  Background:
    Given the application is running
    And I am logged in as a user "alejandro@example.com"
    And I am on the scheduling page

  # --------------------------
  # SCENARIO: Successful scheduling
  # --------------------------
  Scenario: Schedule a meeting successfully with date, time and participants
    When I choose date "2026-01-15" and time "14:00" and duration "60"
    And I add participants "maria@example.com, juan@example.com"
    And I click "Schedule"
    Then the system should save the meeting
    And invitations should be sent to "maria@example.com" and "juan@example.com"
    And I should see the meeting on my calendar for "2026-01-15 14:00"

  # --------------------------
  # SCENARIO: Missing required fields
  # --------------------------
  Scenario: Scheduling fails when required fields are missing
    When I leave the date blank and time blank
    And I click "Schedule"
    Then I should see an error message "Date and time are required"
    And the meeting must not be saved

  # --------------------------
  # SCENARIO: Date/time in the past
  # --------------------------
  Scenario: Scheduling fails when date/time is in the past
    When I choose date "2020-01-01" and time "10:00"
    And I click "Schedule"
    Then I should see an error message "Cannot schedule meeting in the past"
    And the meeting must not be saved

  # --------------------------
  # SCENARIO: Invalid participant emails
  # --------------------------
  Scenario Outline: Scheduling fails due to invalid participant emails
    When I choose date "2026-02-10" and time "09:00"
    And I add participants "<participants>"
    And I click "Schedule"
    Then I should see an error message "Invalid participant email: <invalid>"
    And the meeting must not be saved

    Examples:
      | participants                      | invalid                |
      | "mariaexample.com"                | mariaexample.com       |
      | "juan@,pepe@"                     | juan@                  |
      | "maria@example.com, pepe@bad"     | pepe@bad               |

  # --------------------------
  # SCENARIO: Participant has conflicting event
  # --------------------------
  Scenario: Scheduling warns when a participant has a conflicting event
    Given participant "maria@example.com" has an event at "2026-03-10 15:00" for duration "60"
    When I choose date "2026-03-10" and time "15:00" and duration "60"
    And I add participants "maria@example.com"
    And I click "Schedule"
    Then I should see a warning "Participant maria@example.com has a conflict at this time"
    And I should be asked to confirm or choose a different time
    When I confirm "Schedule anyway"
    Then the meeting should be saved and invitations sent

  # --------------------------
  # SCENARIO: Exceeds maximum participants
  # --------------------------
  Scenario: Scheduling fails when exceeding max participants
    Given the system maximum participants is 10
    When I add 12 participants
    And I choose date "2026-04-01" and time "11:00"
    And I click "Schedule"
    Then I should see an error message "Maximum number of participants is 10"
    And the meeting must not be saved

  # --------------------------
  # SCENARIO: Timezone handling
  # --------------------------
  Scenario: Scheduling with timezone converts date/time for participants
    Given my account timezone is "America/Bogota"
    And participant "anna@example.com" timezone is "Europe/Madrid"
    When I choose date "2026-05-20" and time "09:00" (America/Bogota)
    And I add participants "anna@example.com"
    And I click "Schedule"
    Then the invitation to "anna@example.com" should show the meeting time in "Europe/Madrid"
    And the meeting should be saved with timezone-aware timestamps

  # --------------------------
  # SCENARIO: Daylight savings transition
  # --------------------------
  Scenario: Scheduling across daylight saving time transition adjusts times correctly
    When I choose date "2026-03-29" and time "01:30" and duration "120"
    And I add participants "europe_user@example.com"
    And I click "Schedule"
    Then the meeting should be saved with correct UTC offsets for each participant
    And invitations should contain the correct local times

  # --------------------------
  # SCENARIO: Recurring meeting
  # --------------------------
  Scenario: Schedule a recurring meeting (weekly)
    When I choose date "2026-06-01" and time "10:00" and duration "30"
    And I set recurrence "Weekly" for "4" occurrences
    And I add participants "team@example.com"
    And I click "Schedule"
    Then the system should save 4 meeting instances on the calendar
    And invitations should be sent for each occurrence

  # --------------------------
  # SCENARIO: Edit scheduled meeting
  # --------------------------
  Scenario: Edit a scheduled meeting and notify participants
    Given I have a scheduled meeting on "2026-07-10" at "16:00"
    When I change the meeting time to "17:00"
    And I click "Save changes"
    Then the system should update the meeting
    And updated invitations should be sent to all participants
    And I should see the meeting at the new time on my calendar

  # --------------------------
  # SCENARIO: Cancel scheduled meeting
  # --------------------------
  Scenario: Cancel a scheduled meeting and send cancellations
    Given I have a scheduled meeting on "2026-08-05" at "12:00"
    When I click "Cancel meeting"
    Then the meeting should be removed from my calendar
    And cancellation notices should be sent to participants
    And participants should see the meeting removed from their calendars

  # --------------------------
  # SCENARIO: Invitation sending failure (email service down)
  # --------------------------
  Scenario: Meeting saved but invitations fail when email service is down
    Given the email service is unavailable
    When I choose date "2026-09-10" and time "10:00"
    And I add participants "maria@example.com"
    And I click "Schedule"
    Then the meeting should be saved
    And I should see a message "Invitations could not be sent; they will be retried"
    And the system should queue invitations for retry

  # --------------------------
  # SCENARIO: Resource (meeting room) conflict
  # --------------------------
  Scenario: Scheduling fails when the chosen room/resource is unavailable
    Given the meeting room "Room A" is booked at "2026-10-01 09:00"
    When I choose date "2026-10-01" and time "09:00" and select room "Room A"
    And I click "Schedule"
    Then I should see an error message "Room A is not available at that time"
    And the meeting must not be saved

  # --------------------------
  # SCENARIO: External calendar integration (optional)
  # --------------------------
  Scenario: Scheduling creates event in external calendar when integration enabled
    Given I have connected Google Calendar to my account
    When I schedule a meeting on "2026-11-12" at "13:00"
    And I click "Schedule"
    Then an event should be created in my Google Calendar
    And invitations should be sent with an .ics attachment

  # --------------------------
  # SCENARIO: Reminder settings
  # --------------------------
  Scenario: Schedule meeting with reminders
    When I choose date "2026-12-01" and time "08:00" and set reminder "15 minutes before"
    And I add participants "team@example.com"
    And I click "Schedule"
    Then the system should save the meeting
    And reminders should be scheduled to be sent 15 minutes before the meeting
