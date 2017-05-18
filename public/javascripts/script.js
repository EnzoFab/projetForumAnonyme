$(document).ready(function () {
    // check in the pseudo list if the one chosen is available

    $.post( // check the cookie
        '/checkCookie',{},
        function (data) {
           if(data == true){ // if there isn't a cookie data = true and we display the modal
               displayModal();

           }
        },'text'
    );

    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        });



    // message on the home page

    $('.ui.dropdown') // drop down menu on the modal
        .dropdown();
    
    $("#buttonCreate").click(function () {
        $('.ui.modal#createTopic')
            .modal({
                inverted: true,
                onApprove:function () {

                    console.log($('#catergory').val());
                    // need to change the value

                    // if one input isn't filled
                    if($('input[name="color"]').val() == '' ||
                        $('#category').val()== '' ||
                        $('input[name="topicName"]').val() == ''){
                        message = $('#topicMessage');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }else {
                        $.post(
                            "/topic/create",
                            {
                                color : $('input[name="color"]').val(),
                                topicName :  $('input[name="topicName"]').val(),
                                category: $('#category').val()
                            }
                        );
                    }
                }
            })
            .modal('show');
    });


    function displayModal() {
        $('.ui.basic.test.modal#connexionModal')
            .modal({
                closable  : false,
                onApprove : function() {
                    if($('input[name="user"]').val() == ''){
                        message = $('#message');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }
                    else {
                        $.post(
                            "/newUser",{
                                nickname : $('input[name="user"]').val()
                            },
                            function (data) {
                                if(data ="success"){

                                    return true;
                                }

                                else{
                                    // do somthing on the page
                                    return false;
                                }
                            },'text'
                        );
                    }

                }
            })
            .modal('show'); // show the modal
    }




    $("#information").popup({
        on:'click'
    });


   /* $('.ui.search').search({
        apiSettings: {
            url: '/autocomplete',
            minCharacters : 1,
            onResponse: function(results) {
                var response = {
                    results : []
                };
                $.each(results, function(index, item) {
                    response.results.push({
                        title       : item.name,
                        description : item
                        //url       : item.html_url
                    });
                });
                return response;
            },
        },
    });*/

    // Define API endpoints once globally
    /*$.fn.api.settings.api = {
        'search' : '/autocomplete'
    };
    $('.ui.search')
        .api({
            debug: true,
            action: 'search',
            url: '/autocomplete',
            searchFullText: false,
            stateContext: '.ui.input'
        })
    ;*/

    /*$('.ui.search')
        .search({
            type          : 'category',
            minCharacters : 3,
            apiSettings   : {
                url        : '/autocomplete',
                onResponse : function(githubResponse) {
                    var
                        response = {
                            results : {}
                        }
                    ;
                    console.log(githubResponse[0])
                    if(!githubResponse || !githubResponse.items) {
                        return;
                    }
                    // translate GitHub API response to work with search
                    $.each(githubResponse.items, function(index, item) {
                        var
                            language   = item.language || 'Unknown',
                            maxResults = 8
                        ;
                        if(index >= maxResults) {
                            return false;
                        }
                        // create new language category
                        if(response.results[language] === undefined) {
                            response.results[language] = {
                                name    : language,
                                results : []
                            };
                        }
                        // add result to category
                        response.results[language].results.push({
                            title       : item.name,
                            description : item.description,
                            url         : item.html_url
                        });
                    });
                    return response;
                }
            }
        });*/

    $('.ui.search').search({ apiSettings: { url: '/autocomplete' } });

});