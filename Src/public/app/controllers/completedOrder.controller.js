(function() {

    var CompletedOrderController = function(cartService) {

        var vm = this;

        vm.cart = null;
        vm.isCartEditable = false;

        function init() {

            cartService.getCart()
            .then(function(response) {
                   vm.cart = response.data.cart;
                   codeWithDan.shoppingCart.updateValues({ total: 0 });

                   //Once the cart is displayed clear it on the server
                cartService.clearCart().then(function(response) {

                   });
            }, function(err) {
                console.log(err);
            });
        }

        init();

    };

    CompletedOrderController.$inject = ['cartService'];

    angular.module('codeWithDan').controller('CompletedOrderController', CompletedOrderController);

}());
