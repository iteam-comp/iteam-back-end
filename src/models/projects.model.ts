import { Entity, model, property } from '@loopback/repository';

import { History } from './history.model';

@model()
export class Projects extends Entity {
	@property({
		type: 'string',
		id: true,
		generated: false,
	})
	id: string;

	@property({
		type: 'string',
		required: true,
	})
	name: string;

	@property({
		type: 'string',
	})
	mainParticipantId?: string;

	@property.array(String)
	subParticipants?: string[];

	@property.array(History)
	history?: History[];

	@property.array(String)
	technologies?: string[];

	@property({
		type: 'string',
	})
	startTime?: string;

	@property({
		type: 'string',
	})
	endTime?: string;

	@property({
		type: 'boolean',
	})
	isActive?: boolean;

	constructor(data?: Partial<Projects>) {
		super(data);
	}
}

// export interface ProjectRelations {
// 	// describe navigational properties here
// }

// export type ProjectWithRelations = Projects & ProjectRelations;
export type ProjectWithRelations = Projects;
