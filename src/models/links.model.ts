import { Entity, model, property } from '@loopback/repository';

@model()
export class Links extends Entity {
	@property({
		type: 'string',
		id: true,
		generated: false,
	})
	id?: string;

	@property({
		type: 'string',
		required: true,
	})
	title: string;

	@property({
		type: 'string',
		required: true,
	})
	link: string;

	constructor(data?: Partial<Links>) {
		super(data);
	}
}

// export interface LinksRelations {
// 	// describe navigational properties here
// }

// export type LinksWithRelations = Links & LinksRelations;
export type LinksWithRelations = Links;
