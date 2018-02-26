Feature: Login
    # Username needs to be a valid email address
    # Password needs to be at least 8 characters long

    Scenario Outline: login
        Given a users authentication state is <loggedOut>
        When the user provides <email> and <password>
        Then the users authentication state should be <loggedIn>
        And an error should be <shown>

        Examples:
            |   loggedOut   |   email               |   password    |   loggedIn    |   shown   |
            |   false       |   aaa@bbb.com         |   !A123456    |   true        |   false   |
            |   false       |   abbbb-bb@bbb.com    |   A123456!    |   true        |   false   |
            |   false       |   abbbb-bb@bbb.com    |   A23456!     |   false       |   true    |
