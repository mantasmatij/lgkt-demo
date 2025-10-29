import { Given, When, Then } from '@cucumber/cucumber';

Given('I open the public form page', function () {
  // Placeholder step - E2E runner wires to Playwright in web.cucumber.mjs
});

When('I switch the language to English', function () {
  // Placeholder: Implement with Playwright page.click on LanguageSwitcher "English"
});

Then('I see the form title in English', function () {
  // Placeholder: Assert text "Anonymous Company Form"
});

When('I switch the language to Lithuanian', function () {
  // Placeholder: Implement with Playwright page.click on LanguageSwitcher "Lietuvių"
});

Then('I see the form title in Lithuanian', function () {
  // Placeholder: Assert text "Anoniminė įmonės forma"
});
