import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { AllowedEmails, AllowedEmailsWithRelations } from '../models';

export class AllowedEmailsRepository extends DefaultCrudRepository<
	AllowedEmails,
	typeof AllowedEmails.prototype.id,
	AllowedEmailsWithRelations
> {
	constructor(@inject('datasources.db') dataSource: DbDataSource) {
		super(AllowedEmails, dataSource);
	}
}
