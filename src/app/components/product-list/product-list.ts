import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  totalProducts = 0;
  pageSize = 5;
  pageIndex = 0;
  searchQuery = '';
  selectedCategory = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.pageIndex + 1, this.pageSize, this.searchQuery, this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.body;
          this.totalProducts = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        },
        error: (err) => {
          this.showSnackBar('Erro ao carregar produtos', 'Fechar');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: `Tem certeza que deseja remover o produto "${product.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.showSnackBar('Produto removido com sucesso!', 'Fechar');
            this.loadProducts();
          },
          error: () => {
            this.showSnackBar('Erro ao remover produto', 'Fechar');
          }
        });
      }
    });
  }

  showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
