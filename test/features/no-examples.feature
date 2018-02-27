Feature: Login
    # Username needs to be a valid email address
    # Password needs to be at least 8 characters long

    Scenario: login
        Given a users authentication state is <loggedOut>
        When the user provides <email> and <password>
        Then the users authentication state should be <loggedIn>
        And an error should be <shown>
