import { Entity, model, property } from '@loopback/repository';
import { LinkInterface, WorkTypes } from '../interfaces/UserInterface';

@model()
export class Users extends Entity {
	@property({
		type: 'string',
		id: true,
		generated: false,
	})
	id?: string;

	@property({
		type: 'string',
	})
	googleId: string;

	@property({
		type: 'string',
		required: true,
	})
	email: string;

	@property({
		type: 'string',
		hidden: true,
	})
	password: string;

	@property({
		type: 'number',
		required: false,
	})
	role: number;

	@property({
		type: 'string',
		required: false,
	})
	avatarUrl: string;

	@property({
		type: 'string',
		required: true,
	})
	name: string;

	@property({
		type: 'string',
		required: false,
	})
	surname: string;

	@property({
		type: 'string',
		required: false,
	})
	birthday?: string;

	@property({
		type: 'string',
		required: false,
	})
	offerDay?: string;

	@property({
		type: 'string',
		required: false,
	})
	expirience?: string;

	@property({
		type: 'string',
		required: false,
	})
	file?: string;

	@property({
		type: 'string',
		required: false,
	})
	skills?: string;

	@property({
		type: 'string',
		required: false,
	})
	stack?: string;

	@property({
		type: 'string',
		required: false,
	})
	phone?: string;

	@property({
		type: 'string',
		required: false,
	})
	addres?: string;

	@property({
		type: 'number',
		required: false,
	})
	city?: number;

	@property({
		type: 'boolean',
		required: true,
	})
	isActive: boolean;

	@property({
		type: 'number',
		itemType: 'number',
		required: false,
	})
	team?: number[];

	@property({
		type: 'number',
		required: false,
	})
	company?: number;

	@property({
		type: 'number',
		required: false,
		default: true,
		hidden: true,
	})
	salary?: number;

	@property({
		type: 'string',
		required: false,
	})
	workType?: WorkTypes;

	@property({
		type: 'string',
		required: false,
		itemType: 'object',
	})
	links?: LinkInterface[];

	constructor(data?: Partial<Users>) {
		super(data);
	}
}

// export interface UserRelations {
// 	// describe navigational properties here
// }

// export type UserWithRelations = Users & UserRelations;
export type UserWithRelations = Users;
