import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { decode } from 'deckstrings';

export default Controller.extend({
	deckstring: computed.alias('deck.exportString'),

	saveDeck() {
		const deck = this.get('deck');
		if (deck.name === undefined) {
			deck.set('name', '?');
		}
		deck.set('deckstring', this.get('deckstring'));
		deck.save().then(deck => {
			this.get('deck').deckcards.forEach((deckcard) => {
				deckcard.set('deck', deck);
				deckcard.save();
				this.set('importString', '');
				this.set('deck', null);
				this.set('showDeck', false);
			});
			this.transitionToRoute('user.deck', deck.id);
		});
	},

	actions: {
		import() {
			let importString = this.get('importString');
			const lines = importString.split(/\r?\n/g);
			let name = '';
			let url = '';
			lines.forEach(line => {
				if (line.substr(0, 3) === "###") {
					name = line.substr(4);
				}
				let httpIndex = line.indexOf('http')
				if (httpIndex > -1) {
					url = line.substr(httpIndex);
				}
				if (line.substr(0, 1) !== "#" && line.length) {
					importString = line;
				}
			});
			const decoded = decode(importString);

			this.get('store').findRecord('card', decoded.heroes[0], { include : 'cardclass' }).then(card => {
				const cardclass = card.cardclass;
				const deck = this.get('store').createRecord('deck', {
					cardclass: cardclass,
					name: name,
					url: url
				});

				let deckcard;
				decoded.cards.forEach((decodedcard) => {
					this.get('store').findRecord('card', decodedcard[0]).then(card => {
						deckcard = this.get('store').createRecord('deckcard', {
							card: card,
							number: decodedcard[1]
						});
						deck.deckcards.pushObject(deckcard);
					})
				});
				this.set('deck', deck);
				this.set('deckgroup', {});

				this.set('showDeck', true);
			});
		},

		filterDeckstring(deck) {
			return (deck.deckstring === this.get('deckstring'));
		},

		setUser(user) {
			if (user) {
				this.get('deck').set('user', this.get('model.user'));
			} else {
				this.get('deck').set('user', undefined);
			}
		},

		setDeckgroup(deckgroup) {
			if (deckgroup) {
				this.get('store').findRecord('deckgroup', deckgroup).then(deckgroup => {
					this.get('deck').set('deckgroup', deckgroup);
				});
			} else {
				this.get('deck').set('deckgroup', undefined);
			}
		},

		setCardset(cardset) {
			this.get('store').findRecord('cardset', cardset).then(cardset => {
				this.get('deckgroup').cardset = cardset;
			});
		},

		save() {
			const deckgroup = this.get('deckgroup');
			if (deckgroup && deckgroup.name) {
				const newDeckgroup = this.get('store').createRecord('deckgroup', deckgroup);
				newDeckgroup.save().then(deckgroup => {
					this.get('deck').set('deckgroup', deckgroup);
					this.set('deckgroup', {});
					this.saveDeck();
				})
			} else {
				this.saveDeck();
			}
		}
	}
});
