Feature: Login

    Scenario: login
        Given a users authentication state is <loggedOut>
        When the user provides <email> and <password>
        Then the users authentication state should be <loggedIn>
        And an error should be <shown>
