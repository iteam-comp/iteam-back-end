import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Projects, ProjectWithRelations } from '../models';

export class ProjectsRepository extends DefaultCrudRepository<
	Projects,
	typeof Projects.prototype.id,
	ProjectWithRelations
> {
	constructor(@inject('datasources.db') dataSource: DbDataSource) {
		super(Projects, dataSource);
	}
}
