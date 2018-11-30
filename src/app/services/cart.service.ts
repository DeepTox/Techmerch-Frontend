import { CartItem } from './../model/cart-item';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private numberOfItems = new Subject<number>();
  numberOfItems$ = this.numberOfItems.asObservable();
  constructor(private cookieService: CookieService) { }
  addItem(productId: number, quantity: number) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 10);
    const cartItem = new CartItem(productId, quantity);
    if (this.cookieService.check('cart')) {
      let value = this.cookieService.get('cart');
      if (value.includes(JSON.stringify(cartItem))) {
        return;
      } else {
        value += ';' + JSON.stringify(cartItem);
        this.cookieService.set('cart', value, expires);
      }
    } else {
      this.cookieService.set('cart', JSON.stringify(cartItem), expires);
    }
  }
  removeItem(productId: number) {
    const cartItems = this.getItems();
    this.cookieService.delete('cart');
    const str:  string[] = [];
    for (let i = 0; i < cartItems.length ; i++) {
        if (cartItems[i].productId === productId) {
          cartItems.splice(i, 1);
        }
    }
    if (cartItems.length !== 0) {
      for (let i = 0; i < cartItems.length ; i++) {
        str[i] = JSON.stringify(cartItems[i]);
      }
      this.cookieService.set('cart', str.join(';'));
    }
  }
  getNumberOfItems(): number {
    if (this.cookieService.check('cart')) {
      const str = this.cookieService.get('cart');
      return (str.split(';').length);
    } else { return 0; }
  }
  getItems(): CartItem[] {
    const items: CartItem[] = [];
    if (this.cookieService.check('cart')) {
        const str = this.cookieService.get('cart');
        const cartItems =  str.split(';');
      for (let i = 0 ; i < cartItems.length ; i++) {
        items.push(JSON.parse(cartItems[i]));
      }
      }
      return items;
  }
  updateNumberOfItems(n: number) {
    this.numberOfItems.next(n);
  }
}
