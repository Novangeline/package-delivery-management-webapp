import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { Package } from '../models/package';
import { DatabaseService } from '../services/database.service';
import { KgToGConverterPipe } from '../pipes/kg-to-g-converter.pipe';

@Component({
  selector: 'app-generative-ai',
  standalone: true,
  imports: [FormsModule, KgToGConverterPipe],
  templateUrl: './generative-ai.component.html',
  styleUrl: './generative-ai.component.css'
})
export class GenerativeAiComponent {
  result:string = ''
  socket:any
  packages: Package[]=[];

  constructor(private db: DatabaseService) {
    this.socket = io();
    this.socket.on('genAIserverEvent', (data: any) => {
      this.result = data;
      console.log(data);
    });
  }

  ngOnInit() {
    this.db.getPackages().subscribe((data:any)=>{
      this.packages = data
    });
  }

  sendDestination(destination:string) {
    console.log(destination);
    this.socket.emit('genAIevent', destination);
  }
}
