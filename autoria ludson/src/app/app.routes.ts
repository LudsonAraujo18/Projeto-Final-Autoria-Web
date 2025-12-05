import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductForm } from './components/product-form/product-form';

export const routes: Routes = [
    { path: '', component: ProductList },
    { path: 'create', component: ProductForm },
    { path: 'edit/:id', component: ProductForm },
    { path: '**', redirectTo: '' }
];
