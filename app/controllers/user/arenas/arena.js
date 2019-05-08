import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	cardset: computed('model.cardsets', function() {
		const cardsets = this.get('model.cardsets');
		return cardsets.objectAt(cardsets.length - 1).get('id');
	}),

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
		},

		addGold() {
			const arena = this.get('model.arena');
			const arenareward = this.get('store').createRecord('arenareward', {
				arena: arena,
				gold: this.get('gold')
			});
			arena.arenarewards.pushObject(arenareward);
			arenareward.save();
			this.set('gold', '');
		},

		addDust() {
			const arena = this.get('model.arena');
			const arenareward = this.get('store').createRecord('arenareward', {
				arena: arena,
				dust: this.get('dust')
			});
			arena.arenarewards.pushObject(arenareward);
			arenareward.save();
			this.set('dust', '');
		},

		addPack() {
			const arena = this.get('model.arena');
			const arenareward = this.get('store').createRecord('arenareward', {
				arena: arena,
				cardset: this.get('store').peekRecord('cardset', this.get('cardset'))
			});
			arena.arenarewards.pushObject(arenareward);
			arenareward.save();
		}
	}
});
