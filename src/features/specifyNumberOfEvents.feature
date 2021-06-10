Feature: Specify the number of events

Scenario: When user hasn't specified a number. 32 is the default number
Given the list of events has been loaded
When a user does not enter or select a specific number of events to be shown
Then 32 will be the number of events displayed

Scenario: User can change the number of events they want to see
Given the list of events has been loaded
When a user enters or selects the number of events to be shown
Then the list of events will be re-rendered, as a result displaying the number of events that the user has specified