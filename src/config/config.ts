import { join } from 'node:path';

const Config = {
	salt: 10,
	secret: 'MY-SECRET',
	srcFiles: join(process.cwd(), 'files-src'),
	outFiles: join(process.cwd(), 'files-out'),
	firebaseConfig: {
		apiKey: 'AIzaSyDOjEGXD1SogOeesusS5zWglYWiL7jTa3w',
		authDomain: 'image-converter-api-6807c.firebaseapp.com',
		projectId: 'image-converter-api-6807c',
		storageBucket: 'image-converter-api-6807c.appspot.com',
		messagingSenderId: '928685334722',
		appId: '1:928685334722:web:f933c461ca6aed4ca1db5b',
		measurementId: 'G-T02KT4NSXH',
	},
};

export { Config };
