import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Logs, LogsWithRelations } from '../models';

export class LogsRepository extends DefaultCrudRepository<
	Logs,
	typeof Logs.prototype.id,
	LogsWithRelations
> {
	constructor(@inject('datasources.db') dataSource: DbDataSource) {
		super(Logs, dataSource);
	}
}
