Feature: Permissions affect report exports
  As an authenticated user with varying roles
  I want exports to exclude unauthorized fields and rows
  So that sensitive data is not leaked

  Background:
    Given I am logged in as an "admin"

  Scenario: Admin sees all columns for companies report
    When I open the reports page
    And I select the "Companies List" report
    Then the preview shows all standard columns

  Scenario: Viewer has restricted columns
    Given I am logged in as a "viewer"
    When I open the reports page
    And I select the "Companies List" report
    Then the preview hides restricted columns
