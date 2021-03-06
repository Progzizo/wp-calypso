/**
 * External dependencies
 */
import { pickBy } from 'lodash';

/**
 * Internal dependencies
 */
import 'state/products-list/init';

export function getAvailableProductsList( state ) {
	return pickBy( state.productsList.items, ( product ) => product.available );
}
