import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		return RSVP.hash({
			decks: this.store.findAll('deck'),
			deckgroups: this.store.findAll('deckgroup')
		});
	}
});
