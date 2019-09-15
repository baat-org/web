$(document).ready(function () {
    $('#signup-button').click(function () {
        var email = $("#email").val();
        var name = $("#name").val();
        var password = $("#password").val();
        var signupRequest = '{"query": "mutation { signup ( email: \\\"' + email + '\\\", name: \\\"' + name +'\\\", password: \\\"' + password + '\\\", avatarUrl: \\\"\\\")}", "variables": null}';

        $.ajax({
            contentType: 'application/json',
            data: signupRequest,
            success: function (signupResponse) {
                Cookies.set("X-Auth-Token", signupResponse.data.signup);
                window.location.href = window.location.origin
            },
            error: function (data) {
                $('#error-message').text(data.responseText)
            },
            processData: false,
            type: 'POST',
            url: window.gql_api_uri
        });
    });
});
