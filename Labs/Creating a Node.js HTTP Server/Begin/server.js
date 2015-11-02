

function start(port) {

}

function processHttpRequest(res) {

}

function processJsonRequest(res, pathname) {	
    var json = '';
    switch (pathname) {
        case '/customers':
            json = '[{"firstName":"John", "lastName":"Doe"},' +
                    '{"firstName":"Jane", "lastName":"Doe"}]';
            break;
        case '/orders':
            json = '[{"orderID":"1","quantity":"20"},' + 
                   '{"orderID":"2","quantity":"10"}]';
            break;

    }

    //TODO: Add code here
    
}

