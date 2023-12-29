import { AsyncLocalStorage } from 'node:async_hooks';

const myAls = new AsyncLocalStorage();

function logTypeOfStore(location) {
	console.log(`- (${location}) myAls.getStore() is an ${typeof myAls.getStore()}`);
}

export default {
	async fetch() {
		return myAls.run({ world: 'world!' }, async () => {
			logTypeOfStore('in myAls.run');

			const helloWorldThenable = {
				then(onfulfilled) {
					logTypeOfStore('in helloWorldThenable.then');
					onfulfilled(`hello ${myAls.getStore()?.world}`);
				},
			};

			await new Promise((resolve) => {
				logTypeOfStore('in new Promise');
				resolve();
			}).then(() => {
				logTypeOfStore('in new Promise.then');
			});

			logTypeOfStore('before returning');

			const helloWorldText = await helloWorldThenable;
			return new Response(`${helloWorldText} (👈 this should be "hello world!")`);
		});
	},
};
