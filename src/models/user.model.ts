import { Entity, model, property } from '@loopback/repository';
import { WorkType } from '../etc/enums';
import { Links } from './links.model';

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
		required: true,
	})
	password: string;

	@property({
		type: 'string',
		required: false,
	})
	avatarUrl: string;

	@property({
		type: 'string',
		required: false,
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
	birthday: string;

	@property({
		type: 'string',
		required: false,
	})
	offerDay: string;

	@property({
		type: 'string',
		required: false,
	})
	expirience: string;

	@property({
		type: 'string',
		required: false,
	})
	file: string;

	@property({
		type: 'string',
		required: false,
	})
	skills: string;

	@property({
		type: 'string',
		required: false,
	})
	phone: string;

	@property({
		type: 'string',
		required: false,
	})
	addres: string;

	@property({
		type: 'number',
		required: false,
	})
	city: number;

	@property({
		type: 'number',
		required: false,
	})
	company: number;

	@property({
		type: 'array',
		itemType: 'number',
		required: false,
	})
	stack: number[];

	@property({
		type: 'array',
		itemType: 'number',
		required: false,
	})
	team: number[];

	@property.array(Links)
	links: object[];

	@property({
		type: 'number',
		required: false,
	})
	salary: number;

	@property({
		type: 'string',
		required: false,
	})
	workType: WorkType;

	@property({
		type: 'number',
		required: false,
	})
	role: number;

	@property({
		type: 'boolean',
		required: false,
	})
	isActive: boolean;

	constructor(data?: Partial<Users>) {
		super(data);
	}
}

// export interface UserRelations {
// 	// describe navigational properties here
// }

// export type UserWithRelations = Users & UserRelations;
export type UserWithRelations = Users;
