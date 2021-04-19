(function() {
	let onInstallDemo = false;

	if(Backbone){
		const DemoModel = Backbone.Model.extend( {
			defaults: {
				template_id: 0,
				title: '',
				source: '',
				type: '',
				subtype: '',
				author: '',
				thumbnail: '',
				url: '',
				export_link: '',
				tags: [],
			},
		} );

		onInstallDemo = (model) => {
			const templateModel = new DemoModel(model);

			const args = { model: templateModel };

			console.log(model);

			$e.run('library/open');

			$e.run('library/insert-template', args);

			ponceElementorModal.close();
		};
	}	

	const phpConfig = demosConfig || {};

	const config = {
		...phpConfig,
		onInstallDemo,
	}

	mainIFrame.addConfig(config);
})();