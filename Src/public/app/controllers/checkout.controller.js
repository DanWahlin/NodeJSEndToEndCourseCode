(function() {

    var CartController = function($location, cartService) {

        var vm = this;

        vm.cart = null;
        vm.isCartEditable = false;
        vm.error = null;
        vm.orderInProcess = false;

        vm.checkoutData = {
            name: null,
            creditCardNumber: '4005 5192 0000 0004',
            expirationMonth: null,
            expirationYear: null,
            cvvCode: null
        };


        vm.completeOrder = function() {

            vm.orderInProcess = true;
            cartService.completeOrder(vm.checkoutData)
            .then(function(response) {
                if (response.data.transactionResult.success) {
                    vm.cart = response.data.cart;
                    $location.path('/completedOrder');
                }
                else {
                    vm.error = 'Oops - looks like a problem occurred: ' + data.transactionResult.message;
                }
            }, function(err) {
                console.log(err);
            });

        };

        function init() {

            cartService.getCart()
            .then(function(response) {
                if (response.data.cart && response.data.cart.items.length > 0) {
                       vm.cart = response.data.cart;
                   }
                   else {
                       $location.path('/cart');
                   }
            }, function(err) {
                console.log(err);
            });

        }

        init();

    };

    CartController.$inject = ['$location', 'cartService'];

    angular.module('codeWithDan').controller('CheckoutController', CartController);

}());
