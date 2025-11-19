Feature: Export size limit guidance
  As a user exporting large reports
  I want clear guidance when limits are exceeded
  So that I can adjust filters proactively

  Background:
    Given I am logged in as an "admin"

  Scenario: Large export exceeds limit
    When I open the reports page
    And I select the "Companies List" report
    And I apply a filter that produces more than 50000 rows
    And I attempt to export the report
    Then I see a guidance message about adjusting filters
