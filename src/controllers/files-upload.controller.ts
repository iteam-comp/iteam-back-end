import { authenticate } from "@loopback/authentication";
import { inject, intercept } from "@loopback/core";
import { repository } from "@loopback/repository";
import {
  post,
  requestBody,
  RestBindings,
  Response,
  Request,
  toInterceptor,
  SchemaObject,
  del,
  param,
} from "@loopback/rest";
import { UserRepository } from "../repositories";

import imageCloudinaryId from "../schemas/imageCloudinaryId.schema";
import { filesUploaderSetup } from "../shared/filesUploader.shared";

const {multerUpload, cloudinaryUploader, removeFile} = filesUploaderSetup;

@authenticate("jwt")
export class FilesUploadController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}


  @post("/upload-file/{id}")
  async uploadImage(
    @param.path.string('id') id: string,
    @requestBody.file()
    request: any
  ): Promise<object> {
    const checkUser = await this.userRepository.findById(id);
    if(!checkUser) return this.response.status(404).json({ msg: "User was not founded" });

    return new Promise<object>((resolve, reject) => {

    multerUpload(request, {}, async (err: any) => {
      if (err) {
        console.log('err', err);
        return reject(this.response.status(500));
      };
      cloudinaryUploader.upload(
        `${!process.env.PORT ? "./public/uploads" : "./dist/public/uploads"}/${request.file.filename}`,
        { 
          public_id: `Iteam/users/${id}/${request.file.filename}`,
          resource_type: "raw"
        }, (err: Error, res: any) => {
          if(err) {
            removeFile(request.file.filename); 
            return reject(this.response.status(500).json({msg: "Upload failed, please try later"}));
          }

          removeFile(request.file.filename);
          return resolve(this.response.status(200).json(res));
        }
      );
    });

  }).catch((err) => this.response.status(500).json(err));
  }

  @del("/remove-file/{id}")
  async removeImage (
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: imageCloudinaryId as SchemaObject,
        },
      },
    })
    request: any
  ): Promise<any> {
    const checkUser = await this.userRepository.findById(id);
    if(!checkUser) return this.response.status(400).json({msg: "User was not founded"});

    const { cloudinary_public_id } = request;
    if(! cloudinary_public_id) return this.response.status(400).json({msg: "Cloudinary id was not passed"});

    await cloudinaryUploader.destroy(cloudinary_public_id);
    this.response.status(204);
  }
}
