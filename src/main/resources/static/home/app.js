$(document).ready(function () {

    var userToken = Cookies.get("X-Auth-Token");

    $.ajax({
        contentType: 'application/json',
        data: '{"query": "{ userForToken ( userToken: \\\"' + userToken + '\\\") { id, email, fullName, avatarUrl } }", "variables": null, "operationName":null}',
        success: function (userForTokenResponse) {
            if (userForTokenResponse && userForTokenResponse.data && userForTokenResponse.data.userForToken) {
                var userInfo = userForTokenResponse.data.userForToken;
                showCurrentUserInfo(userInfo);
                createWebSocket(userToken);
                populateUserList();
                bindSendButton(userToken, userInfo);
            }
        },
        error: function (error) {
            $('#error-message').text(error.responseText)
        },
        processData: false,
        type: 'POST',
        url: window.gql_api_uri
    });

    function showCurrentUserInfo(userInfo) {
        $('#user-details').text("Hi " + userInfo.fullName + "!");
    }

    function createWebSocket(userToken) {
        var ws = new WebSocket(window.websockets_uri);

        ws.onmessage = function (event) {
            var replyMessage = JSON.parse(event.data),
                $userLink,
                senderUserFullName;
            if (replyMessage.senderUserId && replyMessage.textMessage) {
                $userLink = $("#user-list").find("a[data-user-id=" + replyMessage.senderUserId + "]");
                senderUserFullName = $userLink.text();

                $userLink.addClass('btn-info');
                $("#message-history-panel").append("<p>" + senderUserFullName + ": " + replyMessage.textMessage + "</p>");
            }
        };

        ws.onclose = function () {
            console.log("Socket closed");
        };

        ws.onopen = function () {
            // TODO may want to do it as part of Connect
            ws.send(userToken);
            console.log("Connected");
        };
    }

    function populateUserList() {
        $.ajax({
            contentType: 'application/json',
            data: '{"query": "{ users { id, email, fullName, avatarUrl } }", "variables": null, "operationName":null}',
            success: function (usersResponse) {
                if (usersResponse && usersResponse.data && usersResponse.data.users) {
                    var userInfos = usersResponse.data.users;
                    for (var i = 0; i < userInfos.length; i++) {
                        var userInfo = userInfos[i];
                        $("#user-list").append("<li>" +
                            "<a id='user-" + userInfo.id + "' data-user-id='" + userInfo.id + "' href='#' class='user-link btn btn-default''>" +
                            "<strong>" + userInfo.fullName + "</strong>" +
                            "</a>" +
                            "</li>");
                    }

                    $("body").on("click", "a.user-link", function () {
                        var $userLink = $(this),
                            $allUserLinks = $("a.user-link"),
                            userId = $userLink.data("user-id");


                        $allUserLinks.removeClass("btn-primary");
                        $allUserLinks.addClass("btn-default");

                        $userLink.removeClass("btn-default");
                        $userLink.removeClass("btn-info");
                        $userLink.addClass("btn-primary");

                        // TODO load user chat history
                        $("#message-history-panel").empty();

                        $("#recipient-user-id").val(userId);
                    });
                }
            },
            error: function (error) {
                $('#error-message').text(error.responseText)
            },
            processData: false,
            type: 'POST',
            url: window.gql_api_uri
        });
    }

    function bindSendButton(userToken, userInfo) {
        $('#send-button').click(function () {
            var recipientUserId = $("#recipient-user-id").val(),
                textMessage = $("#new-message").val(),
                chatMessage = '{"query": "mutation { chat ( senderUserToken: \\\"' + userToken + '\\\", recipientUserId: ' + recipientUserId + ', textMessage: \\\"' + textMessage + '\\\")}", "variables": null}';

            $("#message-history-panel").append("<p>" + userInfo.fullName + ": " + textMessage + "</p>");
            $("#new-message").val("");

            $.ajax({
                contentType: 'application/json',
                data: chatMessage,
                dataType: 'json',
                error: function (error) {
                    $('#error-message').text(error.responseText)
                },
                processData: false,
                type: 'POST',
                url: window.gql_api_uri
            });
        });
    }
});
