var main = function() {
    'use strict';
    var socket = io.connect();
    var $userFormArea = $("#userFormArea");
    var $userForm = $("#userForm");
    var $users = $('#users');
    var $username = $('#username');
    var $mainArea = $("#mainArea");
    var $uploadForm = $('#uploadForm');
    var $upload = $('#upload');
    var $userList = $('#userList');

    socket.on('get users', function(data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            // html+='<li  class="bg-info" >'+ data[i] +'</li>';
            html += '<p class="btn-info btn-sm"> <span class="glyphicon glyphicon-user"></span>' + data[i] + '</p>';
        }
        $userList.html(html);
    });

    $userForm.submit(function(e) {
        e.preventDefault();
        socket.emit('new user', $username.val(), function(data) {
            if (data) {
                $userFormArea.hide();
                $mainArea.show();
            }
        });
        $username.val('');
    });
}

$(document).ready(main);

$('#next_round').on('click', function() {
    other_level();
});

var other_level = function() {
    'use strict';
    var url = "question";
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/" + url,
        crossDomain: true,
        dataType: "json",
    }).done(function(msg) {
        if (msg.answer === false) {
            msg.answer = "false";
        }
    });
};

var getQuestions = function() {
    'use strict';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: 'http://localhost:3000/question',
        success: function(data) {
            console.log('success');
            $('.span').html(data.newQuestion._id);
            console.log($('.span').text());
        }
    });
};



$("#submit_Id").on('click', function() {
    add_new_Question();
    alert("DATA SAVED SUCCESSFULLY");
    $('#questionId').val('');
    $('#answerId').val('');
});


var add_new_Question = function() {
    'use strict';
    var url = "question";
    var question = $("#questionId").val();
    var answer = $("#answerId").val();
    var data = {
        "question": question,
        "answer": answer
    };
    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/" + url,
        crossDomain: true,
        dataType: "json",
        data: data
    }).done(function(msg) {
        if (msg.answer === false) {
            msg.answer = "false";
        }
        $("#displayQueId").show();
        $("#addQueBtnId").show();

        $("#userNameId").hide();
    });
};




jQuery(function($) {
    var socket = io.connect();
    socket.on('newQue', function(question) {
        $('#queId').val(question.question);
        $('#askedQueId').val(question._id);
        $('#askedQueAns').val(question.answer);
    });

    socket.on('score', function(data) {
        $('#rightAns').val(data.right);
        $('#wrongAns').val(data.wrong);
        console.log($('#currentUserId').val());
        if (data.flag == 1) {
            if ($('#currentUserId').val() == $('#' + userName + '').text()) {
                $('#' + userName + '').css("color", "#33D166");
            }
        }
        if (data.flag == 0) {
            if ($('#currentUserId').val() == $('#' + userName + '').text()) {
                $('#' + userName + '').css("color", "#F1492A");
            }
        }
    });

    $('#sendBtnId').on('click', function() {
        console.log($('#ansId').val());
        console.log("Question ::::: ", $('#askedQueId').val());
        socket.emit('score', {
            questionId: $('#askedQueId').val(),
            givenAns: $('#ansId').val(),
            actualAns: $('#askedQueAns').val()
        });
    });

});
