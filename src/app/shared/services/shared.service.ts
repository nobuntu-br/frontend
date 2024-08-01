import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { BaseResourceModel } from "../models/base-resource.model";


export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string, 
    protected injector: Injector, 
    protected jsonDataToResourceFn: (jsonData: any) => T
  ){
    this.http = injector.get(HttpClient);    
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  getById(id: string): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)      
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  update(id, resource: T): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.patch(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    )
  }

  delete(id: string): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.apiPath).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

    // PROTECTED METHODS

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(
          element => resources.push( this.jsonDataToResourceFn(element) )
        );
        return resources;
      }
    
      protected jsonDataToResource(jsonData: any): T {
        return this.jsonDataToResourceFn(jsonData);
      }
    
      protected handleError(error: any): Observable<any>{
        console.log("ERRO NA REQUISIÇÃO => ", error);
        return throwError(error);
      }

}