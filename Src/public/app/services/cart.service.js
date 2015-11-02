(function() {

	var cartService = function($http) {

		var baseUrl = '/api/cart/';
			  csrf = codeWithDan.csrf,
			  service = this;

    service.getCart = function() {
			return $http.get(baseUrl);
		};

    service.putCart = function(cart) {
			return $http.put(baseUrl, {
				_csrf: csrf,
				cart: cart
			});
		};

    service.applyDiscountCode = function(discountCode) {
			return $http.post(baseUrl + 'discountcode', {
					_csrf: csrf,
					discountCode: discountCode
			});
    };

    service.checkout = function(cart) {
			return $http.post(baseUrl + 'checkout', {
				_csrf: csrf,
				cart: cart,
			});
		};

    service.completeOrder = function(checkoutData) {
			return $http.post(baseUrl + 'completeOrder', {
				_csrf: csrf,
				checkoutData: checkoutData
			});
		};

    service.clearCart = function() {
			return $http.post(baseUrl + 'clear', {
				_csrf: csrf
			});
		};
	};

	cartService.$inject = ['$http'];

	angular.module('codeWithDan').service('cartService', cartService);

}());
