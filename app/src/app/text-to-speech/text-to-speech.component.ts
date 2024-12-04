import { Component } from '@angular/core';
import { Driver } from '../models/driver';
import { DatabaseService } from '../services/database.service';
import { UppercaseConverterPipe } from '../pipes/uppercase-converter.pipe';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [UppercaseConverterPipe],
  templateUrl: './text-to-speech.component.html',
  styleUrl: './text-to-speech.component.css'
})
export class TextToSpeechComponent {
  drivers: Driver[]=[];
  file:any = null
  socket:any
  licence:string = ''
  
  constructor(private db: DatabaseService) {
    this.socket = io();
    this.socket.on('text2speechServerEvent', (data: any) => {
      const audioBlob = new Blob([data.file], { type: 'audio/mp3' });
      const audioURL = window.URL.createObjectURL(audioBlob);
      this.file = audioURL
    });
  }

  ngOnInit() {
    this.db.getDrivers().subscribe((data:any)=>{
      this.drivers=data
    });
  }

  textToSpeech(licence: string) {
    this.licence = licence
    this.socket.emit('text2speechEvent', licence);
  }
}
