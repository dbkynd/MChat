import { create, type MyLogger } from '@repo/utilities/logger';

const logger: MyLogger = create('worker');
export default logger;
