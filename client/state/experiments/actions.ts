// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assignVariationForUser() {
	//todo
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assignCurrentUserToVariations = () => ( dispatch: any, getState: any ) => {
	const anonId = getState().experiments.anonId;
	const userId = getState().currentUser.id;
	dispatch( {
		type: 'GET_EXPERIMENT_VARIATIONS',
		anonId: anonId,
		userId: userId,
	} );
};