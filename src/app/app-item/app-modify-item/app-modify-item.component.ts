import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Item, HeroType } from '../../domain/item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectType } from '../../domain/effect.model';

@Component({
  selector: 'app-app-modify-item',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './app-modify-item.component.html',
  styleUrl: './app-modify-item.component.css',
})
export class AppModifyItemComponent {
  heroTypes = Object.values(HeroType);
  effectTypes = Object.values(EffectType);
  itemId: number = 0;
  item: Item = {
    id: 0,
    name: '',
    description: '',
    heroType: HeroType.TANK,
    dropRate: 0,
    image: '',
    status: false,
    effects: [{ effectType: EffectType.BOOST_DEFENSE, value: 0, durationTurns: 0 }],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.itemId = id ? +id : 0;

    if (this.itemId) {
      this.loadItem(this.itemId);
    }
  }

  readImage(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => (this.item.image = reader.result as string);
      reader.readAsDataURL(target.files[0]);
    }
  }

  loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (error) => {
        console.error('Error al cargar item:', error);
        alert('No se pudo obtener los datos del item.');
      },
    });
  }

  validate(): boolean {
    const { name, description, dropRate, heroType, effects } = this.item;

    return !!(
      name &&
      description &&
      dropRate &&
      heroType &&
      effects?.length &&
      effects[0].durationTurns &&
      effects[0].effectType &&
      effects[0].value
    );
  }

  setImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => (this.item.image = reader.result as string);
      reader.readAsDataURL(target.files[0]);
    }
  }

  onSubmit(): void {
    if (!this.validate()) {
      alert('Todos los campos son requeridos.');
      return;
    } else {
      const { _id, ...itemToUpdate } = this.item as any;

      this.itemService.updateItem(this.itemId, itemToUpdate).subscribe({
        next: () => {
          console.log('Item actualizado correctamente.');
          this.router.navigate(['/items/control']);
        },
        error: (error) => {
          console.error('Error al actualizar item:', error);
          alert('Error al actualizar item. Inténtalo de nuevo.');
        },
      });
    }
  }
}
