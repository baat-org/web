$(document).ready(function () {
    $('#signup-button').click(function () {
        var email = $("#email").val();
        var name = $("#name").val();
        var password = $("#password").val();
        var signupRequest = JSON.stringify({
            "email": email,
            "name": name,
            "password": password
        });

        $.ajax({
            contentType: 'application/json',
            data: signupRequest,
            success: function (userToken) {
                Cookies.set("X-Auth-Token", userToken);
                window.location.href = "http://" + location.hostname + ":8082/"
            },
            error: function (data) {
                $('#error-message').text(data.responseText)
            },
            processData: false,
            type: 'PUT',
            url: "http://" + location.hostname + ":8081/signup"
        });
    });
});
