Feature: Enable/Disable Camera
  As a participant
  I want to turn my camera on or off
  So that I can control my visibility in the meeting

  Background:
    Given the application is running
    And I have joined an active meeting as "alejandro@example.com"

  # --------------------------
  # SCENARIO: Toggle camera on and off (happy path)
  # --------------------------
  Scenario: Toggle camera on then off
    Given my camera is initially off
    When I click the camera icon
    Then my video stream should become active
    And the camera icon should show an "on" state
    When I click the camera icon again
    Then my video stream should become inactive
    And the camera icon should show an "off" state

  # --------------------------
  # SCENARIO: Camera permissions denied
  # --------------------------
  Scenario: Camera cannot be enabled because browser blocks permission
    Given my browser has blocked camera permissions
    When I click the camera icon
    Then I should see a permissions prompt or an error "Camera access blocked"
    And my video stream must remain inactive
    And the UI should show guidance to enable camera permissions

  # --------------------------
  # SCENARIO: No camera device available
  # --------------------------
  Scenario: Toggle fails because no camera device is found
    Given the system has no camera devices available
    When I click the camera icon
    Then I should see an error message "No camera found"
    And my video stream must remain inactive

  # --------------------------
  # SCENARIO: Host/Moderator disables participant camera
  # --------------------------
  Scenario: Camera disabled remotely by host
    Given the meeting host has disabled my camera
    When I click the camera icon
    Then I should see a message "Camera disabled by host"
    And my camera must remain off
    And the camera icon should be disabled (not clickable)

  # --------------------------
  # SCENARIO: Bandwidth or network auto-disable
  # --------------------------
  Scenario: Camera is automatically turned off due to low bandwidth
    Given network bandwidth is degraded
    When I click the camera icon to enable
    Then the system may automatically disable video with a warning "Video disabled due to low bandwidth"
    And the camera icon should reflect that video is off
    And I should be informed how to re-enable (e.g., reduce resolution)

  # --------------------------
  # SCENARIO: Toggle persists across reconnect
  # --------------------------
  Scenario: Camera preference persists across rejoin
    Given I toggled my camera off in the meeting
    When I leave and rejoin the same meeting
    Then my camera should remain off on rejoin

  # --------------------------
  # SCENARIO: Remote participants see status update
  # --------------------------
  Scenario: Other participants see my camera state change
    Given Participant B is in the same meeting watching the participant list
    When I turn my camera on
    Then Participant B should see my camera status change to "video on"
    And Participant B should see my live video stream when enabled

  # --------------------------
  # SCENARIO: Switch between multiple cameras
  # --------------------------
  Scenario: Switch camera device while meeting and preserve enable state
    Given my camera is currently enabled using "Front Camera"
    When I switch to "External USB Camera"
    Then my video stream should switch to "External USB Camera"
    And the camera should remain enabled

  # --------------------------
  # SCENARIO: Hotkey toggle
  # --------------------------
  Scenario: Toggle camera using keyboard shortcut
    Given the meeting supports the "V" hotkey to toggle video
    When I press "V"
    Then my video stream should toggle state consistent with clicking the camera icon

  # --------------------------
  # SCENARIO: Preview before joining
  # --------------------------
  Scenario: User can preview camera before joining and toggle there
    Given I am on the pre-join lobby with camera preview visible
    When I click the camera icon in the preview
    Then the preview stream should toggle between active and inactive
    And the chosen preference should apply when I join

  # --------------------------
  # SCENARIO: Start meeting with default camera off setting
  # --------------------------
  Scenario: Meeting default set to camera off
    Given my account preference "Start video muted" is enabled
    When I join a meeting
    Then my camera should be off by default
    And the camera icon should show "off"

  # --------------------------
  # SCENARIO: Privacy indicator (UI) when camera active
  # --------------------------
  Scenario: Visible privacy indicator when camera is active
    When I enable my camera
    Then the UI should show a visible indicator "Camera on" (e.g., red dot or icon)
    And an accessible label "Your camera is on" for screen readers

  # --------------------------
  # SCENARIO: Recording or snapshot blocked by policy
  # --------------------------
  Scenario: Camera cannot be used because of recording policy
    Given the meeting has a policy that disables participant video recording
    When I try to enable my camera
    Then I may be allowed to enable video for live stream but not for recording
    And the UI should clearly indicate recording constraints

  # --------------------------
  # SCENARIO: Camera toggles while screen sharing
  # --------------------------
  Scenario: Toggle camera while screen sharing
    Given I am sharing my screen and my camera is off
    When I enable my camera
    Then the meeting should display both screen share and camera (as picture-in-picture) if supported
    And the camera state should be toggleable independently of screen sharing

  # --------------------------
  # SCENARIO: Error recovery and retry
  # --------------------------
  Scenario: Temporary camera error and retry option
    Given a temporary camera error occurred
    When I click "Retry camera"
    Then the system should attempt to re-initialize the camera device
    And if successful, the video stream should become active
    Otherwise, show an actionable error message

  # --------------------------
  # SCENARIO: Mobile device permissions and backgrounding
  # --------------------------
  Scenario: Mobile app handles camera while app backgrounded
    Given I enabled camera on mobile and then background the app
    When I return to the app
    Then the camera should resume only if the app regained camera permission
    And the UI should show if camera was disabled while backgrounded
