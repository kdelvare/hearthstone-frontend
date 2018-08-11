import Controller from '@ember/controller';

export default Controller.extend({
	queryParams: ['class', 'cost'],
	class: null,
	cost: null,

	actions: {
		toggleParam(name, value) {
			const param = this.get(name);
			if (param === value) {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
		}
	}
});
