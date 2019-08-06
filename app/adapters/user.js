import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
	urlForQueryRecord(query) {
		if (query.me) {
			delete query.me;
			return `/current_user`;
		}

		return this._super(...arguments);
	}
});
