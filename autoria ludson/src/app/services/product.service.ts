import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/products';

    constructor(private http: HttpClient) { }

    getProducts(page: number, limit: number, search: string = '', category: string = ''): Observable<any> {
        let params = new HttpParams()
            .set('_page', page.toString())
            .set('_limit', limit.toString());

        if (search) {
            params = params.set('q', search);
        }
        if (category) {
            params = params.set('category', category);
        }

        return this.http.get<Product[]>(this.apiUrl, { params, observe: 'response' });
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Omit<Product, 'id'>): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: string, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
