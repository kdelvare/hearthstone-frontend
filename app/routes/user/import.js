import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			decks: this.store.findAll('deck', {
				include: 'cardclass,deckgroup,user',
				fields: { deck: 'name,deckstring', cardclass: 'name', deckgroup: 'name', user: 'name' }
			}),
			user: user,
			deckgroups: this.store.findAll('deckgroup'),
			cardsets: this.store.query('cardset', { filter: { collectible: true } })
		});
	}
});
