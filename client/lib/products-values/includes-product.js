/**
 * Internal dependencies
 */
import { assertValidProduct } from 'lib/products-values/utils/assert-valid-product';
import { formatProduct } from 'lib/products-values/format-product';

export function includesProduct( products, product ) {
	product = formatProduct( product );
	assertValidProduct( product );

	return products.indexOf( product.product_slug ) >= 0;
}
