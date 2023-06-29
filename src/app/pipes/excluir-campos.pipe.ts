import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excluirCampos'
})
export class ExcluirCamposPipe implements PipeTransform {

  transform(value: any): any {
    if (value && typeof value === 'object') {
      const camposFiltradores = ['especialidad', 'altura', 'peso','paciente', 'especialista', 'fechaTurno', 'presion','temperatura'];
      return Object.entries(value).filter(([key]) => !camposFiltradores.includes(key));
    }
    return [];
  }
}
