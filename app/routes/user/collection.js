import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true },
		rarity: { refreshModel: true },
		cardset: { refreshModel: true },
		standard: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		let cardFilters = { collectible: true, limit: 28 };
		if (params.class) { cardFilters.cardclass = params.class }
		if (params.cost) { cardFilters.cost = params.cost }
		if (params.rarity) { cardFilters.rarity = params.rarity }
		if (params.cardset) { cardFilters.cardset = params.cardset }
		if (params.standard) { cardFilters.standard = true }
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cards: this.store.query('card', assign(params, { filter: cardFilters, include: 'collections,collections.user', fields: { collections: 'user,number' }, sort: 'cost,name_fr' })),
			user: user
		});
	}
});
