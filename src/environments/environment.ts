// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: "https://ypucwjnulpdbifwgyzhn.supabase.co/rest/v1",
  API_KEY_SUPABASE: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdWN3am51bHBkYmlmd2d5emhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjY5MDMsImV4cCI6MjA2MzQ0MjkwM30.fBrI7fC2bmGXW3yXmQV-dp6krxCMS1bmOcWqk4Gxod8",
  SECRETKEY: "eW>9~NpjI6d~1((BO@rr7>arkMz):F8~ZNgI" ,
  API_OUC:"https://services9.arcgis.com/kKJR3Qt68ohAWuet/arcgis/rest/services/Estaciones_actuales_y_proyectadas_de_Metro_de_Santiago/FeatureServer/0/query?where=1%3D1&outFields=nombre,linea,estacion&outSR=4326&f=json",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
