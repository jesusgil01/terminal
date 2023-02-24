import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Terminal } from 'xterm';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TerminalComponent implements OnInit {
  
  public terminal!: Terminal;
  container!: HTMLElement;

  constructor( private ipcService: IpcService) { }

  ngOnInit(): void {
    this.terminal = new Terminal();
    this.container = document.getElementById('terminalDiv')!;
    this.terminal.open(this.container);

    this.terminal.onData(e => {
      this.ipcService.send("terminal.toTerm", e);
    });

    this.ipcService.on("terminal.incData", (event: any, arg: string) => {
      this.terminal.write(arg);
    });

  }

}
