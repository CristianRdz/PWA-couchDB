const db = new PouchDB('Cristian_Rodriguez_Rodriguez_10C');

// Función para obtener datos desde la API y guardarlos en PouchDB
function fetchData() {
    // Intentamos obtener los datos desde la API
    fetch('/api/data')
        .then(response => {
            // Verificamos que la respuesta sea exitosa
            if (!response.ok) {
                throw new Error('Error en la solicitud a la API');
            }
            return response.json();
        })
        .then(data => {
            // Intentamos obtener el documento desde PouchDB
            db.get('data').then(doc => {
                // Si ya existe, actualizamos solo si hay cambios
                if (doc.message !== data.message) {
                    // Si el mensaje es diferente, actualizamos
                    return db.put({
                        _id: 'data',
                        _rev: doc._rev, // Aseguramos que se conserve la revisión correcta
                        message: data.message
                    });
                } else {
                    console.log('Los datos son los mismos, no es necesario actualizar.');
                }
            }).catch(err => {
                // Si no existe el documento, lo creamos
                if (err.name === 'not_found') {
                    db.put({
                        _id: 'data',
                        message: data.message
                    }).then(() => {
                        console.log('Datos guardados en PouchDB.');
                    }).catch(dbErr => {
                        console.error('Error al guardar datos en PouchDB:', dbErr);
                    });
                } else {
                    console.error('Error al obtener el documento:', err);
                }
            });

            // Actualizar la UI con los datos de la API
            document.getElementById('titulo').innerText = data.message;
        })
        .catch(err => {
            console.error('Error al obtener datos:', err);

            // Si ocurre un error, intentamos obtener los datos desde la base de datos local (PouchDB)
            db.get('data').then(doc => {
                console.log('Datos obtenidos de PouchDB.');
                document.getElementById('titulo').innerText = doc.message;
            }).catch(error => {
                console.error('Error al recuperar datos de PouchDB:', error);
                // Si no se pueden obtener los datos ni de la API ni de la base de datos local
                document.getElementById('titulo').innerText = 'No se pudieron cargar los datos.';
            });
        });
}

// Llamamos a la función para cargar los datos al cargar la página
fetchData();
