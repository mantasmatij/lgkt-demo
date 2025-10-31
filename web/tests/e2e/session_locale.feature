Feature: Session locale persistence
  Scenario: Remember selected language across browser restarts (same session model)
    Given I open the public form page
    When I switch the language to English
    Then I see the form title in English
    And I close and reopen the browser
    Then I see the form title in English
