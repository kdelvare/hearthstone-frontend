import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return this.store.findAll('user');
	},

	setupController(controller, model) {
		this._super(controller, model);
		if (!controller.get('newUser')) {
			controller.set('newUser', this.get('store').createRecord('user'));
		}
		controller.set('initCollection', 'empty');
	}
});
