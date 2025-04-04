import { Mapped } from "~/admin/lib";
import { CollectionResponse } from "./response";
import { CollectionRepository, ICollection } from "~/admin/interfaces";

export class CollectionService extends Mapped<CollectionResponse, ICollection> {
  private collection: CollectionRepository;

  constructor(collection: CollectionRepository) {
    super(CollectionResponse);
    this.collection = collection;
  }

  async getCollections() {
    const collections = await this.collection.getAllCollections();
    return collections.map((collection) => {
      return this.mapped(collection);
    });
  }

  // async createFieldsType() {
  //   try {
  //     const arrFields = Object.entries(FieldTypeToDataType);
  //     return await Promise.all(
  //       arrFields.map(async (e) => {
  //         return await this.fieldType.createField({
  //           name: e[0],
  //           dataType: e[1],
  //         });
  //       })
  //     );
  //   } catch (error) {
  //     return {
  //       error: error as TError<IFieldTypeForm>,
  //       data: null,
  //     };
  //   }
  // }
}
