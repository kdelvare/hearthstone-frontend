import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		return RSVP.hash({
			decks: this.store.findAll('deck'),
			users: this.store.findAll('user'),
			deckgroups: this.store.findAll('deckgroup'),
			cardsets: this.store.query('cardset', { filter: { collectible: true } })
		});
	}
});
