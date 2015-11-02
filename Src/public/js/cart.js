var codeWithDan = codeWithDan || {};

codeWithDan.shoppingCart = function() {

    $(document).ready(function() {

        $('.cartItem').click(function() {
            var product = $(this),
                productId = product.attr('data-productId'),
                priceType = product.attr('data-priceType'),
                discountCode = product.attr('data-discountCode');

            //Change button text
            $('.cartItem[data-productid="' + productId + '"').each(function() {
                var item = $(this);
                var itemPriceType = item.attr('data-pricetype');
                if (itemPriceType === priceType) {
                    item.html('In Cart');
                    window.setTimeout(function() {
                        location.href='/cart';
                    }, 500);

                }
                else {
                    if (itemPriceType.indexOf('rent') > -1) {
                        item.html('Rent');
                    }
                    else {
                        item.html('Buy');
                    }
                }
            })
            addToCart(productId, 1, priceType, discountCode);
        });

        $('.removeCartItem').click(function() {
            var product = $(this);
            var productId = product.attr('data-productId');
            removeFromCart(productId);
        });

        /*$("#headlineAddToCart").click(function() {
            var shelfItem = $(".featured-item");
            shelfItem.css('overflow','visible');
            var clone = $(this).clone(),
                position = $(this).position(),
                bezier_params = {
                start: {
                  x: position.left,
                  y: 0,
                  angle: -90
                },
                end: {
                  x:1010,
                  y:-210,
                  angle: 180,
                  length: .2
                }
              };

            clone.appendTo(shelfItem);
            clone.addClass('addItemAnimation');
            clone.animate({path : new $.path.bezier(bezier_params)}, 600);

        });*/

    });

    addToCart = function(productId, quantity, priceType, discountCode) {
        $.post('/api/cart', {
            productId: productId,
            quantity: quantity,
            priceType: priceType,
            discountCode: discountCode,
            _csrf: codeWithDan.csrf
        })
        .done(function(data) {
            updateValues(data.cart);
        })
        .fail(function(xhr, status, error) {
            alert(error.message);
        });
    },

    updateValues = function(cart) {
        if (!cart) {
            cart = { total: 0 };
        }
        $('.cartTotal').text('$' + cart.total.toFixed(2));
    };

    return {
        updateValues: updateValues
    };

}();
