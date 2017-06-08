﻿$(function () {
    var userId = $("table").data('user-id');
    var tasksHub = $.connection.tasksHub;
    $.connection.hub.start().done(() => {
        tasksHub.server.getAll();
    });
    

    $("#submit").on('click', function () {
        var title = $("#title").val();
        tasksHub.server.newTask(title);
        $("#title").val('');
    });

    tasksHub.client.renderTasks = function (tasks) {
        $("table tr:gt(0)").remove();
        tasks.forEach(function (t) {
            var buttonHtml;
            if (t.HandledBy && t.HandledBy === userId) {
                buttonHtml = `<button data-task-id=${t.Id} class='btn btn-success done'>I'm done!</button>`;
            } else if (t.UserDoingIt) {
                buttonHtml = `<button class='btn btn-warning' disabled>${t.UserDoingIt} is doing this</button>`;
            } else {
                buttonHtml = `<button data-task-id=${t.Id} class='btn btn-info doing'>I'm doing this one!</button>`;
            }
            $("table").append(`<tr><td>${t.Title}</td><td>${buttonHtml}</td></tr>`);
        });
    }

    $("table").on('click', '.done', function() {
        var id = $(this).data('task-id');
        tasksHub.server.setDone(id);
    });

    $("table").on('click', '.doing', function () {
        var id = $(this).data('task-id');
        tasksHub.server.setDoing(id);
    });
});