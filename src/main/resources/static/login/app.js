$(document).ready(function () {
    $('#login-button').click(function () {
        var userName = $("#username").val();
        var password = $("#password").val();
        var authenticate = '{"query": "mutation { authenticate ( userName: \\\"' + userName + '\\\", password: \\\"' + password + '\\\")}", "variables": null}';

        $.ajax({
            contentType: 'application/json',
            data: authenticate,
            success: function (authenticateResponse) {
                if (authenticateResponse && authenticateResponse.data && authenticateResponse.data.authenticate) {
                    Cookies.set("X-Auth-Token", authenticateResponse.data.authenticate);
                    window.location.href = window.location.origin
                } else if (authenticateResponse && authenticateResponse.errors && authenticateResponse.errors.length > 0) {
                    $('#error-message').text(authenticateResponse.errors[0].message)
                }
            },
            error: function (data) {
                $('#error-message').text(data.responseText)
            },
            processData: false,
            type: 'POST',
            url: window.gql_api_uri
        });
    });
    $('#signup-button').click(function () {
        window.location.href = window.location.origin + "/signup"
    });
});
