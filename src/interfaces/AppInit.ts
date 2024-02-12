import { Router } from "express";

export interface IAppOptions {
    exposedResources: IResourceDefinition[];
    beforeResourceMiddlewares: Array<any>;
    afterResourceMiddlewares: Array<any>;
}

export interface IResourceDefinition {
    basePath: string;
    handler: Router;
}
