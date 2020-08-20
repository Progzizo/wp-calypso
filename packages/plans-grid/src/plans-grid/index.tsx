/**
 * External dependencies
 */
import * as React from 'react';
import { useI18n } from '@automattic/react-i18n';
import type { Plans, DomainSuggestions } from '@automattic/data-stores';
import { Title } from '@automattic/onboarding';

/**
 * Internal dependencies
 */
import PlansTable from '../plans-table';
import PlansAccordion from '../plans-accordion';
import PlansDetails from '../plans-details';

/**
 * Style dependencies
 */
import './style.scss';

type PlansSlug = Plans.PlanSlug;

export interface Props {
	header?: React.ReactElement;
	recommendedPlan?: Plans.Plan;
	currentPlan?: Plans.Plan;
	onPlanSelect: ( plan: PlansSlug ) => void;
	onPickDomainClick?: () => void;
	currentDomain?: DomainSuggestions.DomainSuggestion;
	disabledPlans?: { [ planSlug: string ]: string };
	singleColumn?: boolean;
}

const PlansGrid: React.FunctionComponent< Props > = ( {
	header,
	recommendedPlan,
	currentPlan,
	currentDomain,
	onPlanSelect,
	onPickDomainClick,
	disabledPlans,
	singleColumn,
} ) => {
	const { __ } = useI18n();

	return (
		<div className="plans-grid">
			{ header && <div className="plans-grid__header">{ header }</div> }

			<div className="plans-grid__table">
				<div className="plans-grid__table-container">
					{ singleColumn ? (
						<PlansAccordion
							recommendedPlanSlug={ recommendedPlan?.storeSlug ?? '' }
							selectedPlanSlug={ currentPlan?.storeSlug ?? '' }
							onPlanSelect={ onPlanSelect }
							currentDomain={ currentDomain }
							onPickDomainClick={ onPickDomainClick }
							disabledPlans={ disabledPlans }
						></PlansAccordion>
					) : (
						<PlansTable
							selectedPlanSlug={ currentPlan?.storeSlug ?? '' }
							onPlanSelect={ onPlanSelect }
							currentDomain={ currentDomain }
							onPickDomainClick={ onPickDomainClick }
							disabledPlans={ disabledPlans }
						></PlansTable>
					) }
				</div>
			</div>

			<div className="plans-grid__details">
				<div className="plans-grid__details-heading">
					<Title>{ __( 'Detailed comparison' ) }</Title>
				</div>
				<div className="plans-grid__details-container">
					<PlansDetails onSelect={ onPlanSelect } />
				</div>
			</div>
		</div>
	);
};

export default PlansGrid;
