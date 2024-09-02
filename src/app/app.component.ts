import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { OnlineOfflineService } from './shared/services/online-offline.service';
import { OfflineSyncService } from './shared/services/offline-sync.service';

@Component({ 
  selector: 'app-root', 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.scss'] 
}) 
export class AppComponent implements OnInit { 
  title = 'NadirDigital'; 
  isOnline: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset) 
  .pipe( 
    map(result => result.matches), 
    shareReplay() 
  ); 
constructor(private breakpointObserver: BreakpointObserver, private onlineOffline: OnlineOfflineService, private offlineSync: OfflineSyncService) {

 }

ngOnInit(): void {
  this.onlineOffline.onlineStatus$.subscribe((status: boolean) => {
    this.isOnline = status;
    if(status){
      this.offlineSync.syncPendingOperations();
    };
  });   
}
} 
