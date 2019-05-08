import Controller from '@ember/controller';

export default Controller.extend({
	class: 2, // Druid

	actions: {
		save() {
			this.get('store').createRecord('arena', {
				date: new Date(),
				archetype: this.get('archetype'),
				score: this.get('score'),
				done: false,
				win: -1,
				cardclass: this.get('store').peekRecord('cardclass', this.get('class')),
				user: this.get('model.user')
			}).save().then(/*arena => {
				this.transitionToRoute('user.arenas.arena', arena.id);
			}*/);
		}
	}
});
