import { Entity, model, property } from '@loopback/repository';

@model()
export class History extends Entity {
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
	who: string;

	@property({
		type: 'string',
		required: true,
	})
	when: string;

	@property({
		type: 'string',
		required: true,
	})
	event: string;

	constructor(data?: Partial<History>) {
		super(data);
	}
}

// export interface ProjectRelations {
// 	// describe navigational properties here
// }

// export type ProjectWithRelations = Projects & ProjectRelations;
export type HistoryWithRelations = History;
