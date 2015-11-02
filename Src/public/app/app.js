(function() {

    var app = angular.module('codeWithDan', ['ngRoute', 'ngAnimate']);

    app.config(function($routeProvider) {

        $routeProvider.when('/', {
            controller: 'CartController',
            templateUrl: '/app/views/cart.html',
            controllerAs: 'vm'
        })
        .when('/checkout', {
            controller: 'CheckoutController',
            templateUrl: '/app/views/checkout.html',
            controllerAs: 'vm'
        })
        .when('/completedOrder', {
            controller: 'CompletedOrderController',
            templateUrl: '/app/views/completedOrder.html',
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/' });

    });

}());
