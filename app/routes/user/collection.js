import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true },
		cardset: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		let cardFilters = { collectible: true, limit: 28, user: user.id };
		if (params.class) { cardFilters.cardclass = params.class }
		if (params.cost) { cardFilters.cost = params.cost }
		if (params.cardset) { cardFilters.cardset = params.cardset }
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cards: this.store.query('card', assign(params, { filter: cardFilters, include: 'collections,collections.user', fields: { collections: 'user,number' }, sort: 'cost,name_fr' })),
			user: user
		});
	}
});
