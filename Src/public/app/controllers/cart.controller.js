(function() {

    var CartController = function($window, $location, cartService) {

        var vm = this;

        vm.cart = null;
        vm.showDiscountCodeSection = false;
        vm.showDiscountCode = false;
        vm.discountCode = null;
        vm.discountCodeMessage = null;
        vm.discountCodeClass = null;
        vm.isCartEditable = true;
        vm.checkoutText = 'Check Out';

        vm.displayDiscountCode = function() {
            vm.showDiscountCode = true;
        }

        vm.updateTotal = function(item) {

            //Show some instant updates even though we'll make an Ajax call below
            if (item.quantity !== '') {
                item.quantity = parseInt(item.quantity);

                //Update/validate cart details on server
                cartService.putCart(vm.cart)
                .then(function(response) {
                    vm.cart = response.data.cart;
                    processCart();
                }, function(err) {
                    alert('Sorry, unable to update your cart due to an error.');
                });
            }

        };

        vm.applyDiscountCode = function() {

            if (vm.discountCode && vm.cart && vm.cart.items.length) {

                cartService.applyDiscountCode(vm.discountCode)
                    .then(function (response) {
                        vm.cart = response.data.cart;
                        vm.discountCodeMessage = response.data.discountCodeMessage;
                        vm.discountCodeClass = (response.data.discountCodeStatus)?'bg-success':'bg-danger';
                        vm.discountCode = '';
                    }, function (err) {
                        vm.discountCodeError = 'Sorry, unable to apply that discount code.';
                    });

            }

        }

        vm.checkout = function() {

            cartService.checkout(vm.cart)
            .then(function(response) {
                if (response.data.isAuthenticated) {
                    $location.path('/checkout');
                }
                else {
                    $window.location.href = '/login';
                }
            }, function() {
                $window.alert('Sorry, uanble to navigate to the checkout page due to an error.');
            });

        };

        function init() {

            cartService.getCart().then(function(response) {
                vm.cart = response.data.cart;
                processCart();
            }, function(err) {
                console.log(err);
            });

        }

        function processCart() {
            codeWithDan.shoppingCart.updateValues(vm.cart);
            if (vm.cart && vm.cart.items && vm.cart.items.length) {
                vm.showDiscountCodeSection = !vm.cart.discountCode && !vm.cart.itemHasDiscountCode;
            }
            else {
                vm.showDiscountCodeSection = false;
                vm.showDiscountCode = false;
                vm.discountCode = null;
                vm.discountCodeMessage = null;
                vm.discountCodeClass = null;
            }
        }

        init();

    };

    CartController.$inject = ['$window', '$location', 'cartService'];

    angular.module('codeWithDan').controller('CartController', CartController);

}());
