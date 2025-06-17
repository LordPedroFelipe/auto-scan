import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TestDrive } from 'src/app/models/test-drive.model';
import { TestDriveService } from 'src/app/services/test-drive.service';

@Component({
  selector: 'app-test-drive-list',
  templateUrl: './test-drive-list.component.html',
  styleUrls: ['./test-drive-list.component.scss']
})
export class TestDriveListComponent {
    filtrosForm: FormGroup;
    testDrives: TestDrive[] = [];
    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    constructor(private fb: FormBuilder, private service: TestDriveService) {
      this.filtrosForm = this.fb.group({
        customerName: [''],
        customerEmail: [''],
        customerPhone: [''],
        vehicleBrand: [''],
        vehicleModel: [''],
        // isCancelled: [''],
        // isCompleted: [''],
        // isActive: [''],
        // preferredDateStart: [''],
        // preferredDateEnd: ['']
      });
    }

    ngOnInit(): void {
      this.buscar();
    }

    buscar(page: number = 1): void {
      const filtros = this.filtrosForm.value;
      const params = {
        ...filtros,
        pageNumber: page,
        pageSize: this.pageSize
      };

      this.service.listar(params).subscribe(res => {
        this.testDrives = res.items;
        this.totalCount = res.totalCount;
        this.currentPage = res.pageNumber;
      });
    }

    resetar(): void {
      this.filtrosForm.reset();
      this.buscar(1);
    }

    onPageChange(page: number): void {
      this.buscar(page);
    }
    
    editar(loja: any): void {
      /*const dialogRef = this.dialog.open(LojaFormComponent, {
        width: '400px',
        data: loja
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.lojaService.atualizar(loja.id, result).subscribe(() => this.carregarLojas());
        }
      });*/
    }
  
    excluir(id: string): void {
      if (confirm('Deseja realmente excluir esta loja?')) {
        // this.lojaService.excluir(id).subscribe(() => this.carregarLojas());
      }
    }
}
