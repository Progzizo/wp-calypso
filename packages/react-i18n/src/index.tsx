/**
 * External dependencies
 */
import * as React from 'react';
import { createI18n, I18n, LocaleData } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';

export interface I18nReact {
	__: I18n[ '__' ];
	_n: I18n[ '_n' ];
	_nx: I18n[ '_nx' ];
	_x: I18n[ '_x' ];
	isRTL: I18n[ 'isRTL' ];
	i18nLocale: string;
}

const I18nContext = React.createContext< I18nReact >( makeContextValue() );

interface Props {
	localeData?: LocaleData;
}

const useI18nTransformHooks = () => {
	const [ hooks, setHooks ] = React.useState( [] );
	const registerHook = ( hook ) => setHooks( hooks.concat( hook ) );
	const unregisterHook = ( hook ) => setHooks( hooks.filter( ( _hook ) => _hook !== hook ) );

	return { hooks, registerHook, unregisterHook };
};

export const I18nProvider: React.FunctionComponent< Props > = ( { children, localeData } ) => {
	const options = {
		lookup: useI18nTransformHooks(),
		translation: useI18nTransformHooks(),
	};
	const contextValue = React.useMemo< I18nReact >( () => makeContextValue( localeData, options ), [
		localeData,
		options,
	] );
	return <I18nContext.Provider value={ contextValue }>{ children }</I18nContext.Provider>;
};

/**
 * React hook providing i18n translate functions
 *
 * @example
 *
 * import { useI18n } from '@automattic/react-i18n';
 * function MyComponent() {
 *   const { __ } = useI18n();
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 */
export const useI18n = (): I18nReact => React.useContext( I18nContext );

/**
 * React hook providing i18n translate functions
 *
 * @param InnerComponent Component that will receive translate functions as props
 * @returns Component enhanced with i18n context
 *
 * @example
 *
 * import { withI18n } from '@automattic/react-i18n';
 * function MyComponent( { __ } ) {
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 * export default withI18n( MyComponent );
 */
export const withI18n = createHigherOrderComponent< I18nReact >( ( InnerComponent ) => {
	return ( props ) => {
		const i18n = useI18n();
		return <InnerComponent { ...i18n } { ...props } />;
	};
}, 'withI18n' );

function bindI18nFunction( i18n, fnName, options ) {
	const boundFn = i18n[ fnName ].bind( i18n );

	return ( ...args ) => {
		const transformedArguments = ( options?.lookup?.hooks || [] ).reduce(
			( accumulator, hook ) => hook( accumulator, args, fnName, options ),
			args
		);

		const transformedTranslation = ( options?.translation?.hooks || [] ).reduce(
			( accumulator, hook ) => hook( accumulator, transformedArguments, fnName, options ),
			boundFn( transformedArguments )
		);

		return transformedTranslation;
	};
}

/**
 * Utility to make a new context value
 *
 * @param localeData The localeData
 *
 * @returns The context value with bound translation functions
 */
function makeContextValue( localeData?: LocaleData, options ): I18nReact {
	const i18n = createI18n( localeData );
	const i18nLocale = localeData?.[ '' ]?.localeSlug ?? 'en';
	return {
		// __: i18n.__.bind( i18n ),
		__: bindI18nFunction( i18n, '__', options ),
		_n: i18n._n.bind( i18n ),
		_nx: i18n._nx.bind( i18n ),
		_x: i18n._x.bind( i18n ),
		isRTL: i18n.isRTL.bind( i18n ),
		i18nLocale,
		registerTranslationHook: options?.translation?.registerHook,
	};
}
