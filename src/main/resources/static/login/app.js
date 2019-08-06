$(document).ready(function () {
    $('#login-button').click(function () {
        var userName = $("#username").val();
        var password = $("#password").val();
        var userCredentials = JSON.stringify({
            "userName": userName,
            "password": password
        });

        $.ajax({
            contentType: 'application/json',
            data: userCredentials,
            success: function (userToken) {
                Cookies.set("X-Auth-Token", userToken);
                window.location.href = "http://" + location.hostname + ":8082/"
            },
            error: function (data) {
                $('#error-message').text(data.responseText)
            },
            processData: false,
            type: 'PUT',
            url: "http://" + location.hostname + ":8081/authenticate"
        });
    });
    $('#signup-button').click(function () {
        window.location.href = "http://" + location.hostname + ":8082/signup"
    });
});
