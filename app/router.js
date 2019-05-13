import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function() {
	this.route('login');

	this.route('user', function() {
		this.route('profile');
		this.route('collection');
		this.route('packs');
		this.route('deckgroups', function() {
			this.route('deckgroup', { path: '/:deckgroup_id' });
			this.route('classdecks');
		});
		this.route('decks', function() {
			this.route('deck', { path: '/:deck_id' });
			this.route('compare', { path: '/:deck_id1/:deck_id2' });
		});
		this.route('import');
		this.route('stats');
		this.route('wanted');
		this.route('arenas', function() {
			this.route('arena', { path: '/:arena_id' });
		});
	})
});

export default Router;
