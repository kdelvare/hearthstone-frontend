import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		}
	}
});