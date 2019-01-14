import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return this.store.findAll('user');
	},

	setupController(controller, model) {
		this._super(controller, model);
		controller.set('initCollection', 'empty');
	}
});
