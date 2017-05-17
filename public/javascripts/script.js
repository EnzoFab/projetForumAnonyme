$(document).ready(function () {
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