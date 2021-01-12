// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: '',
  //apiURL: 'http://4485949.online-server.cloud:8080/Sipho',
  urlImages: 'http://4485949.online-server.cloud:8080/Sipho/files',
  rutaServer: '',
  permisosEspeciales: [
    {
      idOpcion: 23,
      nombre: 'crud-clientes',
      tooltip: 'accion-clientes',
      activo: 1
    },
    {
      idOpcion: 29,
      nombre: 'crud-empleados',
      tooltip: 'accion-empleados',
      activo: 1
    },
    {
      idOpcion: 30,
      nombre: 'crud-articulos',
      tooltip: 'accion-articulos',
      activo: 1
    },
  ]
};
