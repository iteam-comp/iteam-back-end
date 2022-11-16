import { Request, Response } from 'express';
import LoggerService from 'src/services/logger';
import errorsCatcher from 'src/utils/errorsCatcher';
import Controller from '.';

class EventsController extends Controller {
	static async getEventsViaQuery(req: Request, res: Response) {
		const { project, user, log } = req.query;
		try {
			if (project) {
				const logs = await LoggerService.getLogsByProjectID(
					project as string
				);

				return res.status(200).send(logs);
			}

			if (user) {
				const logs = await LoggerService.getLogsByUserID(
					user as string
				);

				return res.status(200).send(logs);
			}

			if (log) {
				const logById = await LoggerService.getLogByID(log as string);

				return res.status(200).send(logById);
			}

			return res.status(404).send({ msg: 'One of params required' });
		} catch (e) {
			errorsCatcher(res);
		}
	}
}

export default EventsController;