import {authenticate, TokenService} from "@loopback/authentication";
import {TokenServiceBindings} from "@loopback/authentication-jwt";
import {inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from "@loopback/repository";
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response, Response, RestBindings, SchemaObject
} from "@loopback/rest";
import {Projects, Users} from "../models";
import {AllowedEmailsRepository, ProjectRepository, UserRepository} from "../repositories";
import UserLoginSchema from "../schemas/userLogin.schema";
import {compare, detectBcryptEncryption, encrypt} from "../shared/bcrypt.shared";
import {filesUploaderSetup} from "../shared/filesUploader.shared";

const { deleteFolder } = filesUploaderSetup;

@intercept('actions-interceptor')
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AllowedEmailsRepository)
    public allowedEmailsRepository: AllowedEmailsRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @post("/users/login")
  async login(
    @requestBody({
      description: "Required input for login",
      required: true,
      content: {
        "application/json": { schema: UserLoginSchema as SchemaObject },
      },
    })
    credentials: {email: string, password: string, googleId: string}
  ): Promise<Response> {
    const { email, password, googleId } = credentials;

    const isAllowed = await this.allowedEmailsRepository.findOne({where: { email }});
    if(!isAllowed) return this.response.status(403).json({msg: "You are not allowed to pass, please ask admin to have access"});

    const user: any = await this.userRepository.findOne({where: { email }});
    if (!user) return this.response.status(401).json({msg: "Credentilas are wrong"});

    if ( password ) {
      const isMatched =  await compare(password, user.password);
      if (!isMatched) return this.response.status(401).json({msg: "Credentilas are wrong"});
    } else  {
      const userByGoogleId: Users | unknown = await this.userRepository.findOne({where: { googleId }});
      if (!userByGoogleId) return this.response.status(401).json({msg: "Wrong google AUTH"});
    }

    const token = await this.jwtService.generateToken(user);

    const {id, name, isAdmin} = user;

    return this.response.status(200).json({id, email, name, token, isAdmin});
  }

  @intercept('id-interceptor')
  @post("/users/registration")
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, {
            title: "NewUser",
          }),
        },
      },
    })
    user: Users
  ): Promise<Response | Users> {
    const { email, password } = user;

    const isAllowed = await this.allowedEmailsRepository.findOne({where: {email}});
    if (!isAllowed) return this.response.status(401).json({ msg: "You are not allowed to pass, please ask admin to have access" });

    const checkingExistingUser: Users | unknown = await this.userRepository.findOne({where: {email}});
    if (checkingExistingUser) return this.response.status(401).json({ msg: "This email is already in use" });

    if (password) {
      const hashedPassword = await encrypt(password);
      user.password = hashedPassword;
    }

    await this.userRepository.create(user);

    const createdUser: any = await this.userRepository.findOne({where: { email }});
    const token = await this.jwtService.generateToken(createdUser);

    const {id, name, isAdmin} = createdUser;

    return this.response.status(200).json({id, email, name, token, isAdmin});
  }

  @get("/users")
  @authenticate('jwt')
  @response(200, {
    description: "Array of User model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Users, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.userRepository.find(filter);
  }

  @get("/users/{id}/projects/")
  @authenticate('jwt')
  async getUserProjects (
    @param.path.string("id") id: string,
  ) {
    const allProjects: Projects[] = await this.projectRepository.find();

    const userProjects = allProjects.filter((project) => (project.mainParticipantId === id) || project.subParticipants?.includes(id));

    return this.response.status(200).json(userProjects);
  }


  @patch("/users")
  @response(200, {
    description: "User PATCH success count",
    content: { "application/json": { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    user: Users,
    @param.where(Users) where?: Where<Users>
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get("/users/{id}")
  @response(200, {
    description: "User model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Users, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(Users, { exclude: "where" })
    filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.userRepository.findById(id, filter);
  }

  @patch("/users/{id}")
  @response(204, {
    description: "User PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, { partial: true, exclude: ["id"] }),
        },
      },
    })
    user: Users
  ): Promise<void> {
    if(user.password && !detectBcryptEncryption(user.password)) {
      const hashedPassword = await encrypt(user.password);
      user.password = hashedPassword;
    }
    return this.userRepository.updateById(id, user);
  }

  @put("/users/{id}")
  @response(204, {
    description: "User PUT success",
  })
  async replaceById(
    @param.path.string("id") id: string,
    @requestBody() user: Users
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del("/users/{id}")
  @response(204, {
    description: "User DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    try {
    await deleteFolder(`Iteam/users/${id}`);
    } catch (err) {}
    await this.userRepository.deleteById(id);
  }
}
