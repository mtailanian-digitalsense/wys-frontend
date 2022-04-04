## Requerimientos previos

Node v12.18.4 (LTS)

## Preparación

En el terminal, en el directorio del proyecto escribir:

### `npm install`

Esto va a instalar los módulos necesarios para ejecutar el proyecto en modo desarrollo o para generar la versión de producción.

## Inicio en modo desarrollo

### `npm start`

Cuando se complete este comando, se levantará un servidor web que permite el desarrollo de la aplicación y con todas las herramientas de React disponibles. 
Si no se abre automáticamente, dirigirse a [http://localhost:3000](http://localhost:3000) para verlo en el explorador.

La página se va a recargar automáticamente en el caso se realizar cambios

## Inicio en modo producción

### `npm build`

Al finalizar este comando correctamente, se habrá generado en el directorio /build , una versión definitiva de producción consistente en archivos estáticos HTML CSS y JS con bundle de react y los archivos minificados y optimizados.

Este directorio debe ser agregado en el servidor web de preferencia.


## Archivos importantes y estructura general 

* /src/config.js: Edición de urls de los servidores y tokens de servicios externo

* /src/components: Todos los componenentes utilizados en la app
* /src/components/Guest: Componentes usados solo por usuario anónimo
* /src/components/ProjectTYPE: Cada directorio dentro de componentes que comienza con 'Project', tiene los componentes específicos para cada tipo de módulo.