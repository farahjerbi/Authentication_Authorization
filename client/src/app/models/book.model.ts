import { Category } from "./category.enum";
import { User } from "./user.model";

export interface Book{
    idBook:number;
    title:string;
    authorName:string;
    description:string;
    releaseDate?:Date;
    category:Category;
    imageFile?:File;
    image?:string;
    userId?:number;
    user?:User
}