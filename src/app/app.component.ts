import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Person } from './models/person';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    this.getPerson();
  }
  title = 'Front';
  http = inject(HttpClient);
  urlApi = 'https://localhost:7158';

  //Listar pessoas
  person$?: Observable<Person[]>;
  //Buscar pessoas
  searchTerm = '';
  personFound?: Person | null = null;
  //Adicionar pessoas
  addPerson = '';
  //Atualizar pessoa
  idUpdate = '';
  nameUpdate = '';

  getPerson(){
    this.person$ = this.http.get<Person[]>(`${this.urlApi}/person`)
  }

  searchPerson(){
    if (this.searchTerm.trim() === '') {
      this.personFound = null; // Limpa a exibição de busca única
      this.getPerson(); // Lista todas as pessoas novamente
    }else {
      this.http
        .get<Person[]>(`${this.urlApi}/person?searchTerm=${this.searchTerm}`)
        .subscribe((results) => {
          // Exibe o primeiro resultado, se existir
          this.personFound = results.length > 0 ? results[0] : null;
        });
    }
  }

  addPersons(){
    const addName: Person = {
      id:'',
      name: this.addPerson,
    }
    this.http.post<void>(`${this.urlApi}/person`, addName).subscribe(_ => this.getPerson());
  }

  getDataUpdate(person: Person){
    this.idUpdate = person.id;
    this.nameUpdate = person.name;
  }

  updateName(){
    if (!this.nameUpdate || !this.idUpdate)
      return;
    const person: Person = {id: this.idUpdate, name: this.nameUpdate}
    const url = `${this.urlApi}/person/${this.idUpdate}`;

    this.http.put<Person>(url, person).subscribe(_ => {this.getPerson(), this.nameUpdate = '';});
  }
}
