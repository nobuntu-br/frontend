import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsFormComponent } from './products-form/products-form.component'; 
import { ListProductsComponent } from './list-products/list-products.component'; 


const routes: Routes = [
  { path: '', component: ListProductsComponent}, 
  { path: 'new', component: ProductsFormComponent}, 
  { path: ':id/edit', component: ProductsFormComponent} 

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ProductsRoutingModule { }
