import { createServer } from 'http';
import { createApp } from './app';
import { existsSync, mkdirSync } from 'fs';
import { Config } from './config/config';

const PID = process.pid;
const PORT = process.env.PORT || 3000;

if (!existsSync(Config.srcFiles)) {
	mkdirSync(Config.srcFiles, { recursive: true });
}

if (!existsSync(Config.outFiles)) {
	mkdirSync(Config.outFiles, { recursive: true });
}

createServer(createApp()).listen(PORT, () => {
	console.log(`Server running on port: ${PORT}; PID: ${PID}`);
});
