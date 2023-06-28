import {trigger, state, style, transition, animate} from '@angular/animations';


export const deslizarIzqADerAnimacion = trigger('entrarIzqADer', [
    state('void', style({ transform: 'translateX(-100%)' })),
    transition(':enter', [
        animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
    ])
]);


export const bounceIn = trigger('bounceIn', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
      style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]);
