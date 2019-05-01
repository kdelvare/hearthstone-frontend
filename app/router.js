import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function() {
	this.route('login');

	this.route('user', function() {
		this.route('collection');
		this.route('wanted');
		this.route('deckgroups', function() {
			this.route('deckgroup', { path: '/:deckgroup_id' });
			this.route('classdecks');
		});
		this.route('deck', { path: '/decks/:deck_id' });
		this.route('import');
		this.route('stats');
		this.route('profile');
		this.route('packs');
	})
});

export default Router;
