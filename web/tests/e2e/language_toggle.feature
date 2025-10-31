Feature: Language toggle
  Scenario: Toggle language between Lithuanian and English
    Given I open the public form page
    When I switch the language to English
    Then I see the form title in English
    When I switch the language to Lithuanian
    Then I see the form title in Lithuanian
