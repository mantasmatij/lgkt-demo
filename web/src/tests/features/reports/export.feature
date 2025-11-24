Feature: Export current view of a report
  As an authenticated user
  I want to export a previewed report as CSV
  So that I can analyze data offline respecting filters and limits

  Background:
    Given I am an authenticated user
    And I navigate to the reports page

  Scenario: Export Companies List with date range filters
    When I select the "Companies List Report" report type
    And I set a date range from "2025-01-01" to "2025-01-31"
    And I refresh the preview
    And I export the CSV
    Then I should receive a CSV file
    And the CSV should include the metadata row
    And the CSV headers should match the Companies List Report columns
    And the CSV should not exceed the row limit
