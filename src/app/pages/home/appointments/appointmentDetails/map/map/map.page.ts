import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
import { GoogleMap } from '@capacitor/google-maps';
import {
  Appointment,
  MyAppointmentDetails,
  UserToken,
} from 'src/app/shared-resources/types/type.model';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  coordinates: any;
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  bookingSubscription!: Subscription;
  private geocoder = new google.maps.Geocoder();
  displayAddress: any;
  distance!: string;
  targetDate!: Date;
  timeRemaining: string = '';
  appropriateTimeRemaining: any;

  openAppointmentLists!: Observable<MyAppointmentDetails[]>;
  filteredOpenAppointment: any;
  dataOpenSubcription!: Subscription;
  userToken!: UserToken;

  constructor(
    private toastController: ToastController,
    private _appointmentService: AppointmentsService,
    private platform: Platform
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.printCurrentPosition().catch((error) => {
      this.presentLocationToast('bottom');
      console.error('Error getting current position:', error);
    });
    this.getOpenApponments();
  }

  ngOnInit() {
    setTimeout(() => {
      this.getOpenApponments();
    }, 4000);
  }

  getOpenApponments() {
    this.openAppointmentLists = this._appointmentService.getOpenAppointments(
      this.userToken
    );
    this.dataOpenSubcription = this.openAppointmentLists.subscribe(
      (appointment: any) => {
        this.filteredOpenAppointment = appointment[0]; // Initialize the filtered list
        this.targetDate = new Date(this.filteredOpenAppointment?.bookTime);
        this.platform.ready().then(() => {
          this.loadMap();
        });
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  // get Location
  printCurrentPosition = async () => {
    this.coordinates = (await Geolocation.getCurrentPosition()).coords;
    console.log('Current position:', this.coordinates);
  };

  async presentLocationToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Enable your Location First',
      duration: 3500,
      position: position,
    });

    await toast.present();
  }

  loadMap() {
    console.log(
      'Latitude',
      parseFloat(this.filteredOpenAppointment.latitude),
      parseFloat(this.filteredOpenAppointment.longitude)
    );
    const mapOptions: google.maps.MapOptions = {
      center: {
        lat: parseFloat(this.filteredOpenAppointment.latitude),
        lng: parseFloat(this.filteredOpenAppointment.longitude),
      }, // Replace with your coordinates
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Add a marker to the map
    this.addMarker(
      parseFloat(this.filteredOpenAppointment.latitude),
      parseFloat(this.filteredOpenAppointment.longitude)
    ); // Replace with your coordinates
    // Add nurse's marker
    this.addPatientMarker(
      this.coordinates.latitude,
      this.coordinates.longitude
    );

    // Calculate Distance
    const distance = this.calculateDistance(
      parseFloat(this.filteredOpenAppointment.latitude),
      parseFloat(this.filteredOpenAppointment.longitude),
      this.coordinates.latitude,
      this.coordinates.longitude
    );

    this.distance = distance.toFixed(2);
    // console.log('Distance between patient and nurse:', distance.toFixed(2),'km');
    // Get Direction
    this.getDirections(
      parseFloat(this.filteredOpenAppointment.latitude),
      parseFloat(this.filteredOpenAppointment.longitude),
      this.coordinates.latitude,
      this.coordinates.longitude
    );
  }

  addMarker(lat: number, lng: number) {
    this.marker = new google.maps.Marker({
      position: { lat, lng }, // Marker position
      map: this.map,
      title: 'Your Location',
    });
    // Reverse geocode the marker's coordinates
    this.reverseGeocodeMarker(this.marker);
  }

  addPatientMarker(lat: number, lng: number) {
    // const icon = {
    //   url: 'https://mclinic.co.ke/assets/images/map.png',
    //   scaledSize: new google.maps.Size(40, 40), // Set the desired width and height
    // };
    const nurseMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Nurse Location',
      // icon: icon, // Replace with a nurse marker icon
    });
  }

  reverseGeocodeMarker(marker: google.maps.Marker) {
    this.geocoder.geocode(
      { location: marker.getPosition() },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const addressComponents = results[0].address_components;
          let formattedAddress = '';

          // Loop through address components to construct the address
          for (const component of addressComponents) {
            formattedAddress += component.long_name + ', ';
          }
          // Remove the trailing comma and space
          formattedAddress = formattedAddress.slice(0, -2);
          // console.log('Formatted Address:', formattedAddress);
          this.displayAddress = formattedAddress;
        } else {
          console.error(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const degToRad = (degrees: number) => degrees * (Math.PI / 180);

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance; // Distance in kilometers
  }

  getDirections(
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number
  ) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(this.map);

    const request = {
      origin: new google.maps.LatLng(originLat, originLng),
      destination: new google.maps.LatLng(destinationLat, destinationLng),
      travelMode: google.maps.TravelMode.DRIVING, // You can adjust the travel mode
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataOpenSubcription) {
      this.dataOpenSubcription.unsubscribe();
    }
    this.dataOpenSubcription.unsubscribe();
  }
}
