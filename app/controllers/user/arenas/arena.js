import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	arenaclasses: computed('model.cardclasses', function() {
		return this.get('model.cardclasses').filter(cardclass => cardclass.id !== "12")
	}),

	actions: {
		win(cardclass) {
			const arena = this.get('model.arena');
			const arenamatch = this.get('store').createRecord('arenamatch', {
				arena: arena,
				cardclass: cardclass,
				won: true
			});
			arena.arenamatches.pushObject(arenamatch);
			arenamatch.save();

			arena.set('win', arena.win + 1);
			if (arena.win === 12) arena.set('done', true);
			arena.save();
		},

		lose(cardclass) {
			const arena = this.get('model.arena');
			const arenamatch = this.get('store').createRecord('arenamatch', {
				arena: arena,
				cardclass: cardclass,
				won: false
			});
			arena.arenamatches.pushObject(arenamatch);
			arenamatch.save();

			if (arena.arenamatches.filterBy('won', false).length === 3) arena.set('done', true);
			arena.save();
		}
	}
});
