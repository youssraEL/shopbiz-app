import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router, Data, Params} from '@angular/router';
import {Location} from '@angular/common';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {MessageService} from '../../services/message.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { ShoppingList } from 'src/app/models/shoppingList';
import { CartItem } from 'src/app/models/cartItem';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { MatDialog } from '@angular/material';
import { CartModalComponent } from 'src/app/shopping-cart/cart-modal/cart-modal.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {

  //@Input()
  product: Product;
  paramsSubscription: Subscription;
  productId: number;
  shoppingList: ShoppingList;
  shoppingCart: ShoppingCart;
  productForm: FormGroup;
  productCopy: Product;
  fileToUpload: File = null;
  quantity: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private productService: ProductService,
              private shoppingListService: ShoppingListService,
              private shoppingCartService: ShoppingCartService,
              private messageService: MessageService,
              public authService: AuthService,
              @Inject('BaseURL') public baseURL) {
    this.createForm();
  }

  ngOnInit(): void {

    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.productId = params['id'];
        }
      );

    this.getProduct();
    this.quantity = 1;
  }

  getProduct(): void {
    // const id = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(this.productId)
      .subscribe((product) => {
        this.product = product;
        this.productCopy = product;
      });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    this.productCopy = this.productForm.value;
    this.productCopy.id = this.product.id;
    const formData = new FormData();
    formData.append('multipartImage'
          , this.fileToUpload
          , this.fileToUpload.name);
    formData.append('info', new Blob([JSON.stringify(this.productCopy)],
      {
        type: 'application/json'
      }));
    this.productService.updateProduct(formData, this.productCopy)
      .subscribe((product) => {
        this.product = product;
        this.productCopy = product;
        this.productForm.reset();
      },
      error => {
        this.product = null;
        this.productCopy = null;
      }
    );

  }

  onFileChange(event) {
    console.log('on file change');
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      console.log('file ', this.fileToUpload.name);
      //const file = event.target.files[0];
      //this.productForm.get('productImage').setValue(file);
    }
  }

  deleteProduct (product: Product | number): Observable<Product> {
    const id = typeof product === 'number' ? product : product.id;
    return this.productService.deleteProduct(id);
  }

  createForm(): void {
    this.productForm = this.formBuilder.group({
      name: '',
      sku: '',
      category: '',
      featured: '',
      description: '',
      image: '',
      price: '',
      productImage: ''
    });
  }

  onAddToShoppingList() {
    this.shoppingListService.addProductToShoppingList(this.product)
        .subscribe((sl) => {
            console.log('Added product to list: ' + sl);
        },
        _ => console.log('Adding to list failed')
        );
  }

  onAddToShoppingCart() {
    console.log('Adding product to shopping car: ', this.product.id, this.quantity);
    const cartItem: CartItem = new CartItem(this.product, this.quantity);
    this.shoppingCartService.addItemToShoppingCart(cartItem)
    .subscribe((shoppingCart) => {
      console.log('Shopping cart: ', shoppingCart);
      this.shoppingCart = shoppingCart;
      this.openDialog();
    },
    _ => console.log('Add cart failed')
    );
  }

  private log(message: string) {
    this.messageService.add(`ProductService: ${message}`);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open
      (CartModalComponent, {
        width: '35vw',
        maxWidth: '50vw'
      });
  }

}

