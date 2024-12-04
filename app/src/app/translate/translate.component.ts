import { Component } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../services/database.service';
import { io } from 'socket.io-client'
import { KgToGConverterPipe } from '../pipes/kg-to-g-converter.pipe';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [KgToGConverterPipe, FormsModule],
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.css'
})
export class TranslateComponent {
  listResults: string[]=[];
  socket:any
  packages: Package[]=[];
  language:string='';
  languages:string[]=[];
  descriptions: string[]=[];
  availLanguages: { key: string, value: string }[] = [
    { key: "zh-CN", value: "Chinese" },
    { key: "id", value: "Indonesian" },
    { key: "ja", value: "Japanese" }
  ];

  constructor(private db: DatabaseService) {
    this.socket = io();
    this.socket.on('translateServerEvent', (data: any) => {
      this.listResults.push(data.translation);
      this.descriptions.push(data.description)
      this.languages.push(data.language)
      console.log(data);
    });
  }

  ngOnInit() {
    this.db.getPackages().subscribe((data:any)=>{
      this.packages = data
    });
  }

  sendDescription(description:string) {
    console.log(description);
    this.socket.emit('translateEvent', { language: this.language, description: description});
  }
}
