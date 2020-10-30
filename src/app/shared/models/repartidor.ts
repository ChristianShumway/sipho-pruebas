export interface Repartidor {
  customer: string;
  date: string;
  employe: string;
  idCustomer: number;
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
}
