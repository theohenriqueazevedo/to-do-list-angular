import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../componenets/input-add-item/input-add-item.component';
import { IListItems } from '../../interface/IListItrems.inteface';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true)

  #setListItems = signal<IListItems[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  #parseItems(){
    return JSON.parse(localStorage.getItem('@my-list') || '[]');
  }

  #updateLocalStorage() {
    localStorage.setItem('@my-list', JSON.stringify(this.#setListItems()));
    return this.#setListItems.set(this.#parseItems());
  }

  public getInputAndAddItem(value: IListItems){
    localStorage.setItem(
      '@my-list', JSON.stringify([...this.#setListItems(),value])
    )
    return this.#setListItems.set(this.#parseItems())
  }

  public listItemsStage(value: 'pending' | 'completed'){
    return this.getListItems().filter((res: IListItems)=>{
      if(value === 'pending'){
        return !res.checked
      }
      if(value === 'completed'){
        return res.checked
      }
      return res
    });
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }

        return res;
      });

      return oldValue;
    });
  }
  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string){
    this.#setListItems.update((oldValue: IListItems[]) => {
      return oldValue.filter((res) => res.id !== id);
    });

    return this.#updateLocalStorage();
  }

  public deleteAllItems(){

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });

    localStorage.removeItem('@my-list');
    return this.#setListItems.set(this.#parseItems());
  }
}
