Feature: Show/hide an event details

Scenario: An event element is collapsed by default
Given the list of events has been loaded
When the user does not perform any action
Then the event element should be collapsed

Scenario: User can expand an event to see its details
Given the list of events has been loaded
And a user has not expanded a certain event yet
When user clicks on -Show Details- button for an event
Then the event element will be expanded to show the event details

Scenario: User can collapse an event to hide its details
Given the list of events has been loaded
And a user has already expanded a certain event
When user clicks on -Hide Details- button for that event
Then the event element will be collapsed to hide the event details